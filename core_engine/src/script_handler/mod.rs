use std::sync::Once;
use wasm_bindgen::Clamped;
use wasm_bindgen::prelude::*;

use crate::types::GridSettings;

use super::types::{ErrorOutput, Pixel, ScriptType};

mod common;
mod rhai_handler;

static INIT_LOGGER: Once = Once::new();

#[wasm_bindgen]
pub fn run_grid(
    script: String,
    script_type: ScriptType,
    settings: GridSettings,
) -> Result<Clamped<Vec<u8>>, ErrorOutput> {
    INIT_LOGGER.call_once(|| {
        console_log::init_with_level(log::Level::Trace).expect("Error initializing logging");
        log_panics::init();
    });

    let num_pixels = settings.res_x * settings.res_y;
    let mut buf: Vec<Pixel> = Vec::with_capacity(num_pixels as usize);
    let script_handler = get_script_handler(script_type);

    for y in 0..settings.res_y {
        for x in 0..settings.res_x {
            let result = script_handler(&script, x, y, &mut buf);
            if let Err(e) = result {
                return Err(ErrorOutput::new(e, None));
            }
        }
    }

    let rgba: Vec<u8> = buf
        .iter()
        .flat_map(|pixel| [pixel.r, pixel.g, pixel.b, 255])
        .collect();
    Ok(Clamped(rgba))
}

fn get_script_handler(
    script_type: ScriptType,
) -> fn(&str, i32, i32, &mut Vec<Pixel>) -> Result<(), String> {
    match script_type {
        ScriptType::Rhai => rhai_handler::run_rhai,
    }
}
