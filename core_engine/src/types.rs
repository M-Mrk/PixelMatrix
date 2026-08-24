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
impl Position {
    pub fn from_rhai(pos: rhai::Position) -> Self {
        Self {
            line: pos.line().unwrap_or(0) as i32,
            char: pos.position().unwrap_or(0) as i32,
        }
    }
}

#[derive(Serialize, Tsify, Clone)]
#[tsify(into_wasm_abi)]
pub struct ErrorOutput {
    pub text: String,
    pub position: Option<Position>,
    pub logs: Vec<LogMessage>,
}
impl ErrorOutput {
    pub fn new(text: String, position: Option<Position>) -> Self {
        Self {
            text,
            position,
            logs: Vec::new(),
        }
    }
}

#[derive(Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub enum WasmResponse<T> {
    Ok(T),
    Error(ErrorOutput),
}
impl<T> WasmResponse<T> {
    pub fn from_result(res: Result<T, ErrorOutput>) -> Self {
        match res {
            Result::Ok(o) => WasmResponse::Ok(o),
            Result::Err(e) => WasmResponse::Error(e),
        }
    }
}

#[derive(Serialize, Tsify, Clone, Debug)]
#[tsify(into_wasm_abi)]
pub struct LogMessage {
    pub system: String,
    pub log: String,
}
