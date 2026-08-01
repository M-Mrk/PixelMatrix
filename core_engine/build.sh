#!/bin/bash
set -e

trap 'echo "Build was not successful"; exit 1' ERR

cd "$(dirname "$0")"

cargo clippy
wasm-pack build --target web
mkdir -p ../web/wasm/
rm -r ../web/wasm/*
cp -r pkg/* ../web/wasm/
echo "Build successful"
