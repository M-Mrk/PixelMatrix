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
    let script_handler = rhai_handler::run_rhai;
    let script_engine = rhai_handler::create_engine();

    // let mut start = web_time::Instant::now();
    for y in 0..settings.res_y {
        for x in 0..settings.res_x {
            let result = script_handler(&script, x, y, &settings, &script_engine, &mut buf);
            if let Err(e) = result {
                return Err(ErrorOutput::new(e, None));
            }

            // Profile time per pixel
            // if x == settings.res_x - 1 {
            //     let elapsed = start.elapsed();
            //     let elapsed_ms = elapsed.as_secs_f64() * 1000.0;
            //     let ms_per_pixel = elapsed_ms / settings.res_x as f64;
            //     trace!("Time per pixel: {:.3} ms", ms_per_pixel);
            //     start = web_time::Instant::now();
            // }
        }
    }

    let rgba: Vec<u8> = buf
        .iter()
        .flat_map(|pixel| [pixel.r, pixel.g, pixel.b, 255])
        .collect();
    Ok(Clamped(rgba))
}
