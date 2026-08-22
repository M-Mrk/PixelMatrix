use serde::Serialize;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScriptType {
    Rhai,
}

#[derive(Serialize, Tsify, Clone)]
#[tsify(into_wasm_abi)]
pub struct Position {
    pub line: i32,
    pub char: i32,
}

#[derive(Serialize, Tsify, Clone)]
#[tsify(into_wasm_abi)]
pub struct ErrorOutput {
    pub text: String,
    pub position: Option<Position>,
}
impl ErrorOutput {
    pub fn new(text: String, position: Option<Position>) -> Self {
        Self { text, position }
    }
}

#[derive(Serialize, Tsify, Clone)]
#[tsify(into_wasm_abi)]
pub struct LogMessage {
    pub system: String,
    pub log: String,
}
