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
#[derive(Debug, Clone)]
pub struct ErrorOutput {
    pixels: Vec<Pixel>,
    error: String,
}
#[wasm_bindgen]
impl ErrorOutput {
    pub fn new(pixels: Vec<Pixel>, error: String) -> Self {
        Self { pixels, error }
    }

    #[wasm_bindgen(getter)]
    pub fn error(&self) -> String {
        self.error.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn pixels(&self) -> Vec<Pixel> {
        self.pixels.clone()
    }
}
