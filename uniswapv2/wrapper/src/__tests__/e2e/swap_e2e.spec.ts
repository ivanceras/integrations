import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { Currency, Pair, Token, Trade, TxResponse } from "./types";
import path from "path";
import { getPlugins, getTokenList } from "../testUtils";
import { Contract, ethers, providers } from "ethers";
import erc20ABI from "./testData/erc20ABI.json";

jest.setTimeout(360000);

describe("Swap", () => {

  let client: Web3ApiClient;
  let recipient: string;
  let ensUri: string;
  let tokens: Token[];
  let ethersProvider: providers.JsonRpcProvider;
  let ethCurrency: Currency;
  let dai: Token;
  let eth: Token;
  let usdc: Token;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const config: ClientConfig = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);

    // deploy api
    const apiPath: string = path.resolve(__dirname + "../../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    ethersProvider = ethers.providers.getDefaultProvider("http://localhost:8546") as providers.JsonRpcProvider;
    recipient = await ethersProvider.getSigner().getAddress();

    // set up test case data -> pairs
    tokens = await getTokenList();
    dai = tokens.filter(token => token.currency.symbol === "DAI")[0];
    const daiTxResponse = await client.query<{approve: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          approve(
            token: $token
          )
        }
      `,
      variables: {
        token: dai,
      },
    });
    if (daiTxResponse.errors) {
      daiTxResponse.errors.forEach(console.log)
    }
    const daiApprove: string = daiTxResponse.data?.approve?.hash ?? "";
    const daiApproveTx = await ethersProvider.getTransaction(daiApprove);
    await daiApproveTx.wait();

    usdc = tokens.filter(token => token.currency.symbol === "USDC")[0];
    const usdcTxResponse = await client.query<{approve: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          approve(
            token: $token
          )
        }
      `,
      variables: {
        token: usdc,
      },
    });
    const usdcApprove: string = usdcTxResponse.data?.approve.hash ?? "";
    const usdcApproveTx = await ethersProvider.getTransaction(usdcApprove);
    await usdcApproveTx.wait();

    eth = tokens.filter(token => token.currency.symbol === "WETH")[0];
    ethCurrency = {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    };
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully exec ether -> dai -> usdc -> ether trades", async () => {
    const etherDaiData = await client.query<{
      fetchPairData: Pair;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchPairData(
            token0: $token0
            token1: $token1
          )
        }
      `,
      variables: {
        token0: eth,
        token1: dai,
      },
    });
    const daiUsdcData = await client.query<{
      fetchPairData: Pair;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchPairData(
            token0: $token0
            token1: $token1
          )
        }
      `,
      variables: {
        token0: dai,
        token1: usdc,
      },
    });
    const usdcEtherData = await client.query<{
      fetchPairData: Pair;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchPairData(
            token0: $token0
            token1: $token1
          )
        }
      `,
      variables: {
        token0: usdc,
        token1: eth,
      },
    });

    // EXEC: ETH -> dai
    const etherDaiTradeResult = await client.query<{bestTradeExactOut: Trade[]}>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactOut (
            pairs: $pairs
            amountOut: $amountOut
            tokenIn: $tokenIn
          )
        }
      `,
      variables: {
        pairs: [etherDaiData.data!.fetchPairData],
        amountOut: {
          token: dai,
          amount: "1000000000000000000000" // $1,000
        },
        tokenIn: eth,
      },
    });
    const etherDaiTrade = etherDaiTradeResult.data!.bestTradeExactOut[0];
    etherDaiTrade.route.path[0].currency = ethCurrency;
    etherDaiTrade.route.pairs[0].tokenAmount1.token.currency = ethCurrency;
    etherDaiTrade.route.input.currency = ethCurrency;
    etherDaiTrade.inputAmount.token.currency = ethCurrency;
    const etherDaiTxResponse = await client.query<{ exec: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          exec (
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: etherDaiTrade,
        tradeOptions: {
          allowedSlippage: "0.9",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    if (etherDaiTxResponse.errors) {
      etherDaiTxResponse.errors.forEach(console.log)
    }

    expect(etherDaiTxResponse.errors).toBeFalsy
    const etherDaiTxHash: string = etherDaiTxResponse.data?.exec.hash ?? "";
    const etherDaiTx = await ethersProvider.getTransaction(etherDaiTxHash);
    await etherDaiTx.wait();

    const daiContract = new Contract(dai.address, erc20ABI, ethersProvider);
    const daiBalance = await daiContract.balanceOf(recipient);
    expect(daiBalance.gte("1000000000000000000000")).toBeTruthy();

    // EXEC dai -> usdc
    const daiUsdcTradeData = await client.query<{bestTradeExactIn: Trade[]}>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactIn (
            pairs: $pairs
            amountIn: $amountIn
            tokenOut: $tokenOut
          )
        }
      `,
      variables: {
        pairs: [daiUsdcData.data!.fetchPairData],
        amountIn: {
          token: dai,
          amount: "100000000000000000000" // $100
        },
        tokenOut: usdc,
      },
    });
    const daiUsdcTrade = daiUsdcTradeData.data!.bestTradeExactIn[0];
    const daiUsdcTxResponse = await client.query<{ exec: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          exec (
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: daiUsdcTrade,
        tradeOptions: {
          allowedSlippage: "0.9",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    const usdcContract = new Contract(usdc.address, erc20ABI, ethersProvider);
    const usdcBalance = await usdcContract.balanceOf(recipient);

    expect(daiUsdcTxResponse.errors).toBeFalsy();
    const daiUsdcTxHash: string = daiUsdcTxResponse.data?.exec.hash ?? "";
    const daiUsdcTx = await ethersProvider.getTransaction(daiUsdcTxHash);
    await daiUsdcTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toBe("900000000000000000000");
    expect(usdcBalance.gt("0")).toBeTruthy();

    // EXEC usdc -> eth exec
    const usdcEthTradeResult = await client.query<{bestTradeExactIn: Trade[]}>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactIn (
            pairs: $pairs
            amountIn: $amountIn
            tokenOut: $tokenOut
          )
        }
      `,
      variables: {
        pairs: [usdcEtherData.data!.fetchPairData],
        amountIn: {
          token: usdc,
          amount: "10000000" // $10
        },
        tokenOut: eth,
      },
    });
    const usdcEthTrade = usdcEthTradeResult.data!.bestTradeExactIn[0];
    usdcEthTrade.route.path[1].currency = ethCurrency;
    usdcEthTrade.route.pairs[0].tokenAmount1.token.currency = ethCurrency;
    usdcEthTrade.route.output.currency = ethCurrency;
    usdcEthTrade.outputAmount.token.currency = ethCurrency;
    const usdcEthTxResponse = await client.query<{ exec: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          exec (
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: usdcEthTrade,
        tradeOptions: {
          allowedSlippage: "0.9",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    expect(usdcEthTxResponse.errors).toBeFalsy();
    const usdcEthTxHash: string = usdcEthTxResponse.data?.exec.hash ?? "";
    const usdcEthTx = await ethersProvider.getTransaction(usdcEthTxHash);
    await usdcEthTx.wait();

    expect((await usdcContract.balanceOf(recipient)).lt(usdcBalance)).toBeTruthy();

    // SWAP dai -> usdc
    const daiUsdcSwap = await client.query<{ swap: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          swap (
            tokenIn: $token0
            tokenOut: $token1
            amount: $amount
            tradeType: $tradeType
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        token0: dai,
        token1: usdc,
        amount: "100000000000000000000", // $100
        tradeType: "EXACT_INPUT",
        tradeOptions: {
          allowedSlippage: "0.9",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });


    expect(daiUsdcSwap.errors).toBeFalsy();
    const daiUsdcSwapHash: string = daiUsdcSwap.data?.swap.hash ?? "";
    const daiUsdcSwapTx = await ethersProvider.getTransaction(daiUsdcSwapHash);
    await daiUsdcSwapTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toBe("800000000000000000000");

    // SWAP usdc -> dai
    const usdcDaiSwap = await client.query<{ swap: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          swap (
            tokenIn: $token0
            tokenOut: $token1
            amount: $amount
            tradeType: $tradeType
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        token0: usdc,
        token1: dai,
        amount: "100000000000000000000", // $100
        tradeType: "EXACT_OUTPUT",
        tradeOptions: {
          allowedSlippage: "0.9",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    expect(usdcDaiSwap.errors).toBeFalsy();
    const usdcDaiSwapHash: string = usdcDaiSwap.data?.swap.hash ?? "";
    const usdcDaiSwapTx = await ethersProvider.getTransaction(usdcDaiSwapHash);
    await usdcDaiSwapTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toEqual("900000000000000000000");
  });
});