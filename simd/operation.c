#include <wasm_simd128.h>
#include <emscripten.h>
#include <stdio.h> 
#include <stdlib.h>

void EMSCRIPTEN_KEEPALIVE simdFloatAdd (float* a, float* b, float* result, unsigned int length) {
  	int i;
  	printf("simdFloatAdd start\n");
	for (i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t sum = wasm_f32x4_add (va, vb);
        wasm_v128_store(&result[i], sum);
        printf("result[%d]: %f\n", i, result[i]);
	}
}

void EMSCRIPTEN_KEEPALIVE simdIntAdd (int* a, int* b, int* result, unsigned int length) {
  	int i;
  	// printf("simdIntAdd start\n");
	for (i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t sum = wasm_i32x4_add(va, vb);
        wasm_v128_store(&result[i], sum);
        // printf("%d + %d = %d\n", a[i], b[i], result[i]);
	}
}

void EMSCRIPTEN_KEEPALIVE multiply_arrays(int* in_a, int* in_b, int* out, int size) {
  for (int i = 0; i < size; i += 4) {
  	// printf("out is %d\n", out[i]);
    v128_t a = wasm_v128_load(&in_a[i]);
    v128_t b = wasm_v128_load(&in_b[i]);
    v128_t prod = wasm_i32x4_mul(a, b);
    wasm_v128_store(&out[i], prod);
  }
}