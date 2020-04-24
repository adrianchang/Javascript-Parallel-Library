** Compile

* Compile operation.c file with this command emcc operation.c -O3 -msimd128 -s TOTAL_MEMORY=1000MB -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_malloc']" -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'
* Run benchmark.js with this command node --experimental-wasm-simd benchmark.js