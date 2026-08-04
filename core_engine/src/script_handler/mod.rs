use std::sync::Once;
use wasm_bindgen::prelude::*;

use super::types::{ErrorOutput, Pixel, ScriptType};

mod common;
mod rhai_handler;

static INIT_LOGGER: Once = Once::new();

#[wasm_bindgen]
pub fn run_script(
    script: String,
    script_type: ScriptType,
    resolution_width: i64,
    resolution_height: i64,
) -> Result<Vec<Pixel>, ErrorOutput> {
    INIT_LOGGER.call_once(|| {
        console_log::init_with_level(log::Level::Trace).expect("Error initializing logging");
        log_panics::init();
    });

    let num_pixels = resolution_width * resolution_height;
    let mut buf: Vec<Pixel> = Vec::with_capacity(num_pixels as usize);
    let script_handler = get_script_handler(script_type);

    for y in 0..resolution_height {
        for x in 0..resolution_width {
            let result = script_handler(&script, x, y, &mut buf);
            if let Err(e) = result {
                return Err(ErrorOutput::new(e, None));
            }
        }
    }

    Ok(buf)
}

fn get_script_handler(
    script_type: ScriptType,
) -> fn(&str, i64, i64, &mut Vec<Pixel>) -> Result<(), String> {
    match script_type {
        ScriptType::Rhai => rhai_handler::run_rhai,
    }
}
