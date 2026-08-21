use serde::Serialize;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScriptType {
    Rhai,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Position {
    pub line: i32,
    pub char: i32,
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct ErrorOutput {
    text: String,
    position: Option<Position>,
}
#[wasm_bindgen]
impl ErrorOutput {
    pub fn new(text: String, position: Option<Position>) -> Self {
        Self { text, position }
    }

    #[wasm_bindgen(getter)]
    pub fn text(&self) -> String {
        self.text.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Option<Position> {
        self.position.clone()
    }
}

#[derive(Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct LogMessage {
    pub system: String,
    pub log: String,
}
