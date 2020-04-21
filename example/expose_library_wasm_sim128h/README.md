## How to run
Compile test.c with emcc test.c -O0 -msimd128 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' 
Run node.js with node --experimental-wasm-simd test.js 

