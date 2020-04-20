## Porblem faced
* Can't include immintrin.h because the code assume it's going to use x86. However, wasm is not using x86. [Learn more](https://github.com/emscripten-core/emscripten-fastcomp-clang/issues/29) In conclusion, wasm can't use system specific instrinisc which make sense. Thus, we can only use either SIMD vector extension or wasm_simd.h as discribe here(https://emscripten.org/docs/porting/simd.html#porting-simd-code-targeting-asm-js). We are going to explore the Porting SIMD code targeting WebAssembly option. The Porting SIMD code targeting asm.js seems like a bad idea since the speed is going to be bad, which decrease the meaning of using simd and also it's widely recognized as a bad idea by the community. There are two path for using WebAssembly optino. The first one is using SIMD vector extension. The second one is using wasm_sim128.h. We are going to explore both of them in other examples.



## Reminders
a.out is the compiled cpp file to show that simd can work here
