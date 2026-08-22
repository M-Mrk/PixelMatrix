use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::{Clamped, prelude::*};

use crate::types::LogMessage;

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

#[derive(Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct GridSettings {
    pub res_x: i32,
    pub res_y: i32,
    pub clamp: bool,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct GridSuccessReturn {
    pixels: Vec<u8>,
    logs: Vec<LogMessage>,
}

impl GridSuccessReturn {
    pub fn new(pixels: Vec<u8>, logs: Vec<LogMessage>) -> Self {
        Self { pixels, logs }
    }
}

#[wasm_bindgen]
impl GridSuccessReturn {
    #[wasm_bindgen(getter)]
    pub fn pixels(&self) -> Clamped<Vec<u8>> {
        Clamped(self.pixels.clone())
    }

    #[wasm_bindgen(getter)]
    pub fn logs(&self) -> Vec<LogMessage> {
        self.logs.clone()
    }
}
