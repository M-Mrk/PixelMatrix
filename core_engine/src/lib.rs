use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum ScriptType {
    Rhai,
}

#[wasm_bindgen]
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
pub fn run_script(
    script: String,
    script_type: ScriptType,
    resolution_width: i64,
    resolution_height: i64,
) -> Vec<Pixel> {
    let num_pixels = resolution_width * resolution_height;
    let mut buf: Vec<Pixel> = Vec::with_capacity(num_pixels as usize);

    for row in 0..resolution_height {
        for column in 0..resolution_width {
            let pixel = if (row + column) % 2 == 0 {
                Pixel::from_tuple((255, 255, 0))
            } else {
                Pixel::from_tuple((255, 0, 255))
            };
            buf.push(pixel);
        }
    }

    return buf;
}
