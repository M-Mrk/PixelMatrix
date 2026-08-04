use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScriptType {
    Rhai,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Pixel {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}
impl Pixel {
    pub fn from_tuple(rgb: (u8, u8, u8)) -> Self {
        Self {
            r: rgb.0,
            g: rgb.1,
            b: rgb.2,
        }
    }
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
