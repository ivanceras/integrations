#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("Http request error: {0}")]
    HttpRequestError(String),
    #[error("Decoding from hex: {0}")]
    FromHexError(#[from] hex::FromHexError),
    #[error("Error decoding json: {0}")]
    JsonError(#[from] serde_json::Error),
    #[error("Unable to get chain Metadata")]
    NoMetadata,
    #[error("Unable to get chain Genesis hash")]
    NoGenesisHash,
    #[error("Unable to get chain Runtime version")]
    NoRuntimeVersion,
    #[error("Codec error: {0}")]
    CodecError(#[from] codec::Error),
    #[error("Error response: {0}")]
    ResponseJsonError(serde_json::Value),
    #[error("No response")]
    NoResponse,
}
