use super::rhai_handler;
use super::types::{GridSettings, Pixel};
use crate::outputs::common::init_logging;
use crate::outputs::grid::types::GridSuccessReturn;
use crate::types::{ErrorOutput, ScriptType, WasmResponse};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run_grid(
    script: String,
    script_type: ScriptType,
    settings: GridSettings,
) -> WasmResponse<GridSuccessReturn> {
    init_logging();
    let num_pixels = settings.res_x * settings.res_y;
    let mut buf: Vec<Pixel> = Vec::with_capacity(num_pixels as usize);
    let script_handler = rhai_handler::run_rhai;
    let script_engine = rhai_handler::create_engine();

    // let mut start = web_time::Instant::now();
    for y in 0..settings.res_y {
        for x in 0..settings.res_x {
            let result = script_handler(&script, x, y, &settings, &script_engine, &mut buf);
            if let Err(err) = result {
                return WasmResponse::Error(err);
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
    let success_output = GridSuccessReturn::new(rgba, Vec::new());
    WasmResponse::from_result(Ok(success_output))
}
