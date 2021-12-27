// NOTE: This is generated by 'w3 codegen', DO NOT MODIFY

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

export interface SwapArgs {
  tokenIn: Token;
  tokenOut: Token;
  amount: BigInt;
  tradeType: TradeType;
}

export interface Currency {
  decimals: UInt8;
  symbol?: String | null;
  name?: String | null;
}

export interface Token {
  chainId: ChainId;
  address: String;
  currency: Currency;
}

export interface Price {
  baseToken: Token;
  quoteToken: Token;
  denominator: BigInt;
  numerator: BigInt;
  price: string;
}

export interface Route {
  pools: Array<Pool>;
  path: Array<Token>;
  input: Token;
  output: Token;
}

export interface Tick {
  index: Int32;
  liquidityGross: BigInt;
  liquidityNet: BigInt;
}

export interface TickListDataProvider {
  ticks: Array<Tick>;
}

export interface Pool {
  token0: Token;
  token1: Token;
  fee: FeeAmount;
  sqrtRatioX96: BigInt;
  liquidity: BigInt;
  tickCurrent: Int32;
  tickDataProvider?: TickListDataProvider | null;
}

export interface Trade {
  swaps: Array<TradeSwap>;
  tradeType: TradeType;
  inputAmount: TokenAmount;
  outputAmount: TokenAmount;
}

export interface TokenAmount {
  token: Token;
  amount: BigInt;
}

export interface TradeSwap {
  route: Route;
  inputAmount: TokenAmount;
  outputAmount: TokenAmount;
}

export interface SwapOptions {
  slippageTolerance: String;
  recipient: String;
  deadline: BigInt;
  inputTokenPermit?: PermitOptions | null;
  sqrtPriceLimitX96?: BigInt | null;
  fee?: FeeOptions | null;
}

export interface PermitOptions {
  v: PermitV;
  r: String;
  s: String;
  amount?: BigInt | null;
  deadline?: BigInt | null;
  nonce?: BigInt | null;
  expiry?: BigInt | null;
}

export interface FeeOptions {
  fee: String;
  recipient: String;
}

export interface MethodParameters {
  calldata: String;
  value: String;
}

export interface GasOptions {
  gasPrice?: BigInt | null;
  gasLimit?: BigInt | null;
}

export interface NextTickResult {
  index: Int32;
  found: Boolean;
}

export interface PoolChangeResult {
  amount: TokenAmount;
  nextPool: Pool;
}

export interface TradeRoute {
  route: Route;
  amount: TokenAmount;
}

export interface UncheckedTradeRoute {
  route: Route;
  inputAmount: TokenAmount;
  outputAmount: TokenAmount;
}

export interface SimulatedSwapResult {
  amountCalculated: BigInt;
  sqrtRatioX96: BigInt;
  liquidity: BigInt;
  tickCurrent: Int32;
}

export interface SwapStepResult {
  sqrtRatioNextX96: BigInt;
  amountIn: BigInt;
  amountOut: BigInt;
  feeAmount: BigInt;
}

export interface IncentiveKey {
  rewardToken: Token;
  pool: Pool;
  startTime: BigInt;
  endTime: BigInt;
  refundee: String;
}

export interface ClaimOptions {
  tokenId: BigInt;
  recipient: String;
  amount?: BigInt | null;
}

export interface FullWithdrawOptions {
  owner: String;
  data?: String | null;
  tokenId: BigInt;
  recipient: String;
  amount?: BigInt | null;
}

export interface QuoteOptions {
  sqrtPriceLimitX96?: BigInt | null;
}

export interface CommonAddLiquidityOptions {
  slippageTolerance: String;
  deadline: BigInt;
  useNative?: Token | null;
  token0Permit?: PermitOptions | null;
  token1Permit?: PermitOptions | null;
}

export interface AddLiquidityOptions {
  recipient?: String | null;
  createPool?: Boolean | null;
  tokenId?: BigInt | null;
  slippageTolerance: String;
  deadline: BigInt;
  useNative?: Token | null;
  token0Permit?: PermitOptions | null;
  token1Permit?: PermitOptions | null;
}

export interface SafeTransferOptions {
  sender: String;
  recipient: String;
  tokenId: BigInt;
  data?: String | null;
}

export interface CollectOptions {
  tokenId: BigInt;
  expectedCurrencyOwed0: TokenAmount;
  expectedCurrencyOwed1: TokenAmount;
  recipient: String;
}

export interface NFTPermitOptions {
  v: PermitV;
  r: String;
  s: String;
  deadline: BigInt;
  spender: String;
}

export interface RemoveLiquidityOptions {
  tokenId: BigInt;
  liquidityPercentage: String;
  slippageTolerance: String;
  deadline: BigInt;
  burnToken?: Boolean | null;
  permit?: NFTPermitOptions | null;
  collectOptions: CollectOptions;
}

export interface BestTradeOptions {
  maxNumResults?: UInt32 | null;
  maxHops?: UInt32 | null;
}

export interface Position {
  pool: Pool;
  tickLower: UInt32;
  tickUpper: UInt32;
  liquidity: BigInt;
}

export interface MintAmounts {
  amount0: BigInt;
  amount1: BigInt;
}

export enum ChainIdEnum {
  MAINNET,
  ROPSTEN,
  RINKEBY,
  GOERLI,
  KOVAN,
}

export type ChainIdString =
  | "MAINNET"
  | "ROPSTEN"
  | "RINKEBY"
  | "GOERLI"
  | "KOVAN"

export type ChainId = ChainIdEnum | ChainIdString;

export enum FeeAmountEnum {
  LOWEST,
  LOW,
  MEDIUM,
  HIGH,
}

export type FeeAmountString =
  | "LOWEST"
  | "LOW"
  | "MEDIUM"
  | "HIGH"

export type FeeAmount = FeeAmountEnum | FeeAmountString;

export enum TradeTypeEnum {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export type TradeTypeString =
  | "EXACT_INPUT"
  | "EXACT_OUTPUT"

export type TradeType = TradeTypeEnum | TradeTypeString;

export enum PermitVEnum {
  v_0,
  v_1,
  v_27,
  v_28,
}

export type PermitVString =
  | "v_0"
  | "v_1"
  | "v_27"
  | "v_28"

export type PermitV = PermitVEnum | PermitVString;

export enum RoundingEnum {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export type RoundingString =
  | "ROUND_DOWN"
  | "ROUND_HALF_UP"
  | "ROUND_UP"

export type Rounding = RoundingEnum | RoundingString;

/// Imported Objects START ///

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Connection {
  node?: String | null;
  networkNameOrChainId?: String | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: BigInt | null;
  gasPrice?: BigInt | null;
  value?: BigInt | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxResponse {
  hash: String;
  to?: String | null;
  from: String;
  nonce: UInt32;
  gasLimit: BigInt;
  gasPrice?: BigInt | null;
  data: String;
  value: BigInt;
  chainId: UInt32;
  blockNumber?: BigInt | null;
  blockHash?: String | null;
  timestamp?: UInt32 | null;
  confirmations: UInt32;
  raw?: String | null;
  r?: String | null;
  s?: String | null;
  v?: UInt32 | null;
  type?: UInt32 | null;
  accessList?: Array<Ethereum_Access> | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Access {
  address: String;
  storageKeys: Array<String>;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxReceipt {
  to: String;
  from: String;
  contractAddress: String;
  transactionIndex: UInt32;
  root?: String | null;
  gasUsed: BigInt;
  logsBloom: String;
  transactionHash: String;
  logs: Array<Ethereum_Log>;
  blockNumber: BigInt;
  blockHash: String;
  confirmations: UInt32;
  cumulativeGasUsed: BigInt;
  effectiveGasPrice: BigInt;
  byzantium: Boolean;
  type: UInt32;
  status?: UInt32 | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Log {
  blockNumber: BigInt;
  blockHash: String;
  transactionIndex: UInt32;
  removed: Boolean;
  address: String;
  data: String;
  topics: Array<String>;
  transactionHash: String;
  logIndex: UInt32;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxRequest {
  to?: String | null;
  from?: String | null;
  nonce?: UInt32 | null;
  gasLimit?: BigInt | null;
  gasPrice?: BigInt | null;
  data?: String | null;
  value?: BigInt | null;
  chainId?: UInt32 | null;
  type?: UInt32 | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_StaticTxResult {
  result: String;
  error: Boolean;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_EventNotification {
  data: String;
  address: String;
  log: Ethereum_Log;
}

// TODO: does the fact that this was created suggest there was a duplicate type in the typeinfo?
/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export interface ERC20_Ethereum_Connection {
  node?: String | null;
  networkNameOrChainId?: String | null;
}

/// Imported Objects END ///
