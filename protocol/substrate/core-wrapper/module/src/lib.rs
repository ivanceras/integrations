pub mod w3;
use base_api::BaseApi;
use w3::imported::*;
pub use w3::*;

mod base_api;
pub mod error;
mod utils;

getrandom::register_custom_getrandom!(totally_random_numbers_trust_me);

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
    /*
    let runtime_metadata = BaseApi::new("http://localhost:9933").fetch_runtime_metadata();
    debug!("runtime_metadata: {:?}", runtime_metadata);
    */

    let raw_version =
        BaseApi::new("http://localhost:9933").json_request_value("state_getRuntimeVersion", ());
    debug!("raw_version: {:#?}", raw_version);

    let raw_block =
        BaseApi::new("http://localhost:9933").json_request_value("chain_getBlock", vec![0]);

    debug!("raw_block: {:?}", raw_block);

    let raw_metadata =
        BaseApi::new("http://localhost:9933").json_request_value("state_getRuntimeMetadata", ());
    debug!("raw_metadata: {:#?}", raw_metadata);

    let mut buf = [0u8; 32];
    getrandom::getrandom(&mut buf).expect("must not error");
    debug!("buff: {:?}", buf);

    CustomType {
        prop: String::from("nothing to see here.."),
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
