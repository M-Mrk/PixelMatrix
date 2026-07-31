/* tslint:disable */
/* eslint-disable */

export class ErrorOutput {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static new(pixels: Pixel[], error: string): ErrorOutput;
    readonly error: string;
    readonly pixels: Pixel[];
}

export class Pixel {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    b: number;
    g: number;
    r: number;
}

export enum ScriptType {
    Rhai = 0,
}

export function run_script(script: string, script_type: ScriptType, resolution_width: bigint, resolution_height: bigint): Pixel[];

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_erroroutput_free: (a: number, b: number) => void;
    readonly __wbg_get_pixel_b: (a: number) => number;
    readonly __wbg_get_pixel_g: (a: number) => number;
    readonly __wbg_get_pixel_r: (a: number) => number;
    readonly __wbg_pixel_free: (a: number, b: number) => void;
    readonly __wbg_set_pixel_b: (a: number, b: number) => void;
    readonly __wbg_set_pixel_g: (a: number, b: number) => void;
    readonly __wbg_set_pixel_r: (a: number, b: number) => void;
    readonly erroroutput_error: (a: number) => [number, number];
    readonly erroroutput_new: (a: number, b: number, c: number, d: number) => number;
    readonly erroroutput_pixels: (a: number) => [number, number];
    readonly run_script: (a: number, b: number, c: number, d: bigint, e: bigint) => [number, number, number, number];
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
