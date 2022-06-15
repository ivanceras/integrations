//#![no_std]

pub mod w3;
//use mycelium::Api;
use base_api::BaseApi;
use getrandom::register_custom_getrandom;
use log::info;
use sp_core::H256;
use w3::imported::*;
pub use w3::*;
use web3api_wasm_rs::w3_debug_log;

mod base_api;
pub mod error;
mod utils;

register_custom_getrandom!(totally_random_numbers_trust_me);

#[macro_export]
macro_rules! debug {
    ($($arg: expr),*) => {
        web3api_wasm_rs::w3_debug_log(&format!($($arg,)*));
    }
}

pub fn totally_random_numbers_trust_me(buf: &mut [u8]) -> Result<(), getrandom::Error> {
    for b in buf.iter_mut() {
        *b = 4;
    }
    Ok(())
}

// curl -H "Content-Type: application/json"
//      -d '{"id":1, "jsonrpc":"2.0", "method": "rpc_methods"}'
// http://localhost:9933/
pub fn chain_get_block_hash(input: InputChainGetBlockHash) -> CustomType {
    //let genesis_hash = BaseApi::new("http://localhost:9933").fetch_genesis_hash();
    //debug!("genesis_hash: {:?}", genesis_hash);
    let mut buf = [0u8; 32];
    getrandom::getrandom(&mut buf).expect("must not error");
    debug!("buff: {:?}", buf);

    let url = String::from("http://localhost:9933");
    println!("visiting url: {}", url);
    let body = r#"{"id":1, "jsonrpc":"2.0", "method": "rpc_methods"}"#;
    let value: serde_json::Value = serde_json::from_str(body).expect("must decode");
    w3_debug_log(&format!("got value from body: {:?}", value));

    w3_debug_log(&format!(
        "im debugging from inside rust suing w3 debug log: {}",
        url
    ));

    let response: Result<Option<HttpResponse>, String> = HttpQuery::post(&http_query::InputPost {
        url: url,
        request: Some(HttpRequest {
            response_type: HttpResponseType::TEXT,
            headers: Some(vec![HttpHeader {
                key: String::from("Content-Type"),
                value: String::from("application/json"),
            }]),
            url_params: Some(vec![HttpUrlParam {
                key: String::from("dummyQueryParam"),
                value: String::from("20"),
            }]),
            body: Some(body.to_string()),
        }),
    });

    let response = response.unwrap().unwrap();
    CustomType {
        prop: response.body.unwrap(),
    }
}

pub fn chain_get_runtime_metadata(input: InputChainGetRuntimeMetadata) -> String {
    println!("does compile but has no effect");
    "Just some metadata".to_string()
}

#[cfg(test)]
mod test {
    use super::*;
    use wasm_bindgen_test::*;

    #[test]
    //#[wasm_bindgen_test]
    fn test1() {
        //assert_eq!(1, 2);
        let input = InputChainGetBlockHash {
            argument: Some("Something".to_string()),
        };
        let result = chain_get_block_hash(input);
        println!("result: {:#?}", result);
        panic!();
    }
}
