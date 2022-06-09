/*
   Copyright 2019 Supercomputing Systems AG

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

use hex::FromHexError;
use sp_core::H256;

pub trait FromHexStr {
    fn from_hex(hex: &str) -> Result<Self, hex::FromHexError>
    where
        Self: Sized;
}

impl FromHexStr for Vec<u8> {
    fn from_hex(hex: &str) -> Result<Self, hex::FromHexError> {
        let hexstr = hex.trim_matches('\"').trim_start_matches("0x");

        hex::decode(&hexstr)
    }
}

impl FromHexStr for H256 {
    fn from_hex(hex: &str) -> Result<Self, FromHexError> {
        let vec = Vec::from_hex(hex)?;

        match vec.len() {
            32 => Ok(H256::from_slice(&vec)),
            _ => Err(hex::FromHexError::InvalidStringLength),
        }
    }
}
