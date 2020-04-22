# Javascript parallel framework

## Overview

We are going to use WebAssembly Threads and SIMD to build a Javascript parallel library so that users can fasten their program by simply calling our functions. 

* Support functionalities:
  * SIMD primitives
* Example usage:
  * TBD

## Design rationale 

The reason why are implementing our own simd primitives such as array addition in js rather than provide simd operation wrapper is that writing explicit simd in js is not a good idea. The web programmer don't know about the underlying system that the code is running on. Thus, they don't know about the cache size etc... So it's not a good idea to write explicit simd code in js. Also, if one really wants, they can always write simd in c/c++ and compile into wasm. The purpose of this library is to make it easy for web programmers to speedup their js code.

## How to setup

* [Intsall emcc](https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install)

## For developers
* ### Webassembly intro
  Webassembly is an innovative low-level language that can run on all modern browsers. With js glue, js file can execute wasm. 
  A typical workflow of running c/c++ in js is as follow. Compile the c/c++ code with emscripten. Emscripten will generate wasm file and js glue file. The js glue file contains the generated code to manage the wasm code. In our own js file, we can call the wasm function(converted from c/c++) from the js glue file.

  Webasembly is running in the same sandbox as js. Thus, they can share the same memory. Webassembly uses [Javascript typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) as memory. Thus, for example, to pass an array to a c/c++ function we need to malloc it in js, set the values then pass the pointer. See example/expose_library_wasm_sim128h for more examples.

  For this project, we use wasm_sim128.h in our c/c++ code and build wrappers that let js programmers to easily use simd operations without touch the raw memory and stuff.

* ### Compilation

  * Basic compile: emsdk/upstream/emscripten/emcc fileToComile.c.
  * -O1, -O2, -O3 to set optimize level. NOTE: to use -O3 we need to explicitly -s EXPORTED_FUNCTIONS="['_malloc']". It's a compiler problem.
  * -s EXPORTED_FUNCTIONS='["_function_name"]' to expose the function in .c . Or in C include <emscripten.h> and use EMSCRIPTEN_KEEPALIVE as an annotation before function definition to identify the function as an export function
  * -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' to enable the use of ccal and cwrap.
  * Example: emcc test.c -O0 -msimd128 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'

* ### Running js

  * Run it with tag --experimental-wasm-simd. Otherwise, errors will occur. 
  * Example: node --experimental-wasm-simd test.js

* ### Things to notice

  * Console.log can only be called we run time is intialized. See example int_sqrt

## Porblem faced

* Can't include immintrin.h because the code assume it's going to use x86. However, wasm is not using x86. [Learn more](https://github.com/emscripten-core/emscripten-fastcomp-clang/issues/29) In conclusion, wasm can't use system specific instrinisc which make sense. Thus, we can only use either SIMD vector extension or wasm_simd.h as discribe here(https://emscripten.org/docs/porting/simd.html#porting-simd-code-targeting-asm-js). We are going to explore the Porting SIMD code targeting WebAssembly option. The Porting SIMD code targeting asm.js seems like a bad idea since the speed is going to be bad, which decrease the meaning of using simd and also it's widely recognized as a bad idea by the community. There are two path for using WebAssembly optino. The first one is using SIMD vector extension. The second one is using wasm_sim128.h. We are going to explore both of them in other examples.

## Benchmark 

* Check out benchmark.js in the simd folder

## Information
* [Useful tutorial](https://marcoselvatici.github.io/WASM_tutorial/index.html#WASM_workflow)

## Future Work
