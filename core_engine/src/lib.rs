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

fn run_rhai(script: &str, x: i64, y: i64, buf: &mut Vec<Pixel>) -> Result<(), String> {
    let mut engine = rhai::Engine::new();

    let script_return = engine.eval::<rhai::Array>(script);
    if script_return.is_err() {
        let err = script_return.unwrap_err();
        match *err {
            rhai::EvalAltResult::ErrorMismatchOutputType(req_type, actual_type, pos) => {
                return Err(format!(
                    "Unexpected return at {}! Return is of type '{}' and not the expected '{}'! Example return: [255, 125, 50] in the order of RGB.",
                    pos, actual_type, req_type,
                ));
            }
            _ => {
                return Err(format!("Bad script! Error: {}", *err));
            }
        }
    }
    let raw_script_color = script_return.unwrap();
    if raw_script_color.len() > 3 {
        return Err(format!(
            "Bad return! '{:?}' is too long. Make sure to return an array of 3 u8's. Example return: [255, 125, 50] in the order of RGB.",
            raw_script_color
        ));
    }

    let mut script_color = Vec::with_capacity(raw_script_color.len());
    for val in raw_script_color {
        if let Some(int_val) = val.clone().try_cast::<i64>() {
            script_color.push(int_val);
        } else {
            return Err(format!(
                "Bad return! Array elements must all be integers. Bad type was '{}'",
                val.type_name()
            ));
        }
    }

    if script_color.iter().any(|val| *val > 255_i64) {
        return Err(format!(
            "Bad return! '{:?}' can not be used as 3 8-bit unsigned integers. Make sure all 3 values are not more than 255.",
            script_color
        ));
    }

    let mut color: (u8, u8, u8) = (255, 255, 255);
    color.0 = script_color[0] as u8;
    color.1 = script_color[1] as u8;
    color.2 = script_color[2] as u8;

    buf.push(Pixel::from_tuple(color));
    Ok(())
}

fn get_script_handler(
    script_type: ScriptType,
) -> fn(&str, i64, i64, &mut Vec<Pixel>) -> Result<(), String> {
    match script_type {
        ScriptType::Rhai => run_rhai,
    }
}

#[wasm_bindgen]
pub fn run_script(
    script: String,
    script_type: ScriptType,
    resolution_width: i64,
    resolution_height: i64,
) -> Result<Vec<Pixel>, ErrorOutput> {
    let num_pixels = resolution_width * resolution_height;
    let mut buf: Vec<Pixel> = Vec::with_capacity(num_pixels as usize);
    let script_handler = get_script_handler(script_type);

    for x in 0..resolution_width {
        for y in 0..resolution_height {
            let result = script_handler(&script, x, y, &mut buf);
            if result.is_err() {
                return Err(ErrorOutput::new(buf, result.unwrap_err()));
            }
        }
    }

    Ok(buf)
}
