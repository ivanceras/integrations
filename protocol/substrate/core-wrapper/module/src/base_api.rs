use crate::w3::imported::http_query;
use crate::w3::HttpHeader;
use crate::w3::HttpQuery;
use crate::w3::HttpRequest;
use crate::w3::HttpResponse;
use crate::w3::HttpResponseType;
use crate::{error::Error, utils::FromHexStr};
use frame_metadata::RuntimeMetadataPrefixed;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use sp_core::{Decode, H256};
use sp_version::RuntimeVersion;

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct JsonReq {
    id: usize,
    jsonrpc: String,
    method: String,
    params: serde_json::Value,
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct JsonResult {
    id: usize,
    jsonrpc: String,
    result: serde_json::Value,
}

/// This api doesn't need Metadata, Runtime version to work
/// It just fetch the content right away
pub struct BaseApi {
    /// the url of the substrate node we are running the rpc call from
    url: String,
}

impl BaseApi {
    pub fn new(url: &str) -> Self {
        Self {
            url: url.to_string(),
        }
    }

    /// Get the runtime metadata of a substrate node.
    /// This is equivalent to running the following command
    ///
    /// `curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getMetadata"}' http://localhost:9933/`
    ///
    /// Which makes an rpc call of a substrate node running locally.
    pub fn fetch_runtime_metadata(&self) -> Result<Option<RuntimeMetadataPrefixed>, Error> {
        let value = self.json_request_value("state_getMetadata", ())?;
        match value {
            Some(value) => {
                let value_str = value
                    .as_str()
                    .expect("Expecting a string value on the result");
                let data = Vec::from_hex(value_str)?;
                let rt_metadata = RuntimeMetadataPrefixed::decode(&mut data.as_slice())?;
                Ok(Some(rt_metadata))
            }
            None => Ok(None),
        }
    }

    /// Make a rpc request and return the result.result if it has value
    pub(crate) fn json_request_value<P: Serialize>(
        &self,
        method: &str,
        params: P,
    ) -> Result<Option<serde_json::Value>, Error> {
        let result = self.json_request(method, params)?;
        if result.result.is_null() {
            Ok(None)
        } else {
            Ok(Some(result.result))
        }
    }

    /// Do the actual rpc call into the substrate node using `reqwest` crate.
    /// Note: reqwest crate can run in a tokio runtime or in webassembly runtime, which is why
    /// we are able to compile this whole library into wasm.
    ///
    fn json_request<P: Serialize>(&self, method: &str, params: P) -> Result<JsonResult, Error> {
        let param = JsonReq {
            id: 1,
            jsonrpc: "2.0".to_string(),
            method: method.to_string(),
            params: serde_json::to_value(params)?,
        };
        println!("param: {:#?}", param);
        crate::debug!("param: {:#?}", param);
        crate::debug!("url: {}", self.url);
        crate::debug!(
            "display param: {:?}",
            serde_json::to_string(&param).unwrap()
        );

        let response: Result<Option<HttpResponse>, String> =
            HttpQuery::post(&http_query::InputPost {
                url: self.url.clone(),
                request: Some(HttpRequest {
                    response_type: HttpResponseType::TEXT,
                    headers: Some(vec![HttpHeader {
                        key: String::from("Content-Type"),
                        value: String::from("application/json"),
                    }]),
                    url_params: None,
                    body: Some(serde_json::to_string(&param)?),
                }),
            });

        crate::debug!("response: {:#?}", response);

        let response = match response {
            Ok(response) => response,
            Err(err) => return Err(Error::HttpRequestError(err)),
        };

        match response {
            Some(response) => match response.body {
                Some(body) => Ok(serde_json::from_str(&body)?),
                None => Err(Error::NoResponse),
            },
            None => Err(Error::NoResponse),
        }
    }
}
