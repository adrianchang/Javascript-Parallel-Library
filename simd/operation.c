#include <wasm_simd128.h>
#include <emscripten.h>
#include <stdio.h> 
#include <stdlib.h>

void EMSCRIPTEN_KEEPALIVE simd_add_int (int* a, int* b, int* result, unsigned int length) {
  for (int i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t sum = wasm_i32x4_add(va, vb);
        wasm_v128_store(&result[i], sum);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_add_float (float* a, float* b, float* result, unsigned int length) {
	for (int i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t sum = wasm_f32x4_add (va, vb);
        wasm_v128_store(&result[i], sum);
	}
}

void EMSCRIPTEN_KEEPALIVE simd_sub_int (int* a, int* b, int* result, unsigned int length) {
  for (int i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t ans = wasm_i32x4_sub(va, vb);
        wasm_v128_store(&result[i], ans);
  }
}


void EMSCRIPTEN_KEEPALIVE simd_sub_float (float* a, float* b, float* result, unsigned int length) {
	for (int i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t ans = wasm_f32x4_sub(va, vb);
        wasm_v128_store(&result[i], ans);
	}
}

void EMSCRIPTEN_KEEPALIVE simd_multiply_int(int* in_a, int* in_b, int* out, int size) {
  for (int i = 0; i < size; i += 4) {
    v128_t a = wasm_v128_load(&in_a[i]);
    v128_t b = wasm_v128_load(&in_b[i]);
    v128_t prod = wasm_i32x4_mul(a, b);
    wasm_v128_store(&out[i], prod);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_multiply_float(float* in_a, float* in_b, float* out, int size) {
  for (int i = 0; i < size; i+=4){
    v128_t a = wasm_v128_load(&in_a[i]);
    v128_t b = wasm_v128_load(&in_b[i]);
    v128_t prod = wasm_f32x4_mul(a, b);
    wasm_v128_store(&out[i], prod);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_div_float(float* in_a, float* in_b, float* out, int size) {
  // for (int i = 0; i < size; i+=4){
  //   v128_t a = wasm_v128_load(&in_a[i]);
  //   v128_t b = wasm_v128_load(&in_b[i]);
  //   v128_t div = wasm_f32x4_div(a, b);
  //   wasm_v128_store(&out[i], div);
  // }
}

void EMSCRIPTEN_KEEPALIVE simd_min_int(int* a, int* b, int* result, unsigned int length) {
  for (int i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t min = wasm_i32x4_min(va, vb);
        wasm_v128_store(&result[i], min);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_min_float(float* in_a, float* in_b, float* out, int size) {
  for (int i = 0; i < size; i+=4){
    v128_t a = wasm_v128_load(&in_a[i]);
    v128_t b = wasm_v128_load(&in_b[i]);
    v128_t min = wasm_f32x4_min(a, b);
    wasm_v128_store(&out[i], min);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_max_int(int* a, int* b, int* result, unsigned int length) {
  for (int i = 0; i < length; i += 4) {
        v128_t va = wasm_v128_load(&a[i]);
        v128_t vb = wasm_v128_load(&b[i]);
        v128_t max = wasm_i32x4_max(va, vb);
        wasm_v128_store(&result[i], max);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_max_float(float* in_a, float* in_b, float* out, int size) {
  for (int i = 0; i < size; i+=4){
    v128_t a = wasm_v128_load(&in_a[i]);
    v128_t b = wasm_v128_load(&in_b[i]);
    v128_t max = wasm_f32x4_max(a, b);
    wasm_v128_store(&out[i], max);
  }
}

void EMSCRIPTEN_KEEPALIVE simd_compare_and_swap_int(int* in, int size){

  for (int i = 0; i < size; i+=4){

    v128_t input;

    if(i + 4 > size){
      int padded_in[4] = {__INT32_MAX__, __INT32_MAX__, __INT32_MAX__, __INT32_MAX__};
      int j = size - i;
      for(int j=0; j<size-i; j++){
        padded_in[j] = in[i+j];
      }
      input = wasm_v128_load(padded_in);

    } else {
      input = wasm_v128_load(&in[i]);
    }

    v128_t swapped = wasm_v32x4_shuffle(input, input, 1, 0, 3, 2);
    v128_t compare = wasm_i32x4_lt(input, swapped);
    compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(1, 0, 1, 0));
    v128_t res = wasm_v128_bitselect(swapped, input, compare);
    wasm_v128_store(&in[i], res);
  }

  

}

void EMSCRIPTEN_KEEPALIVE simd_sort_int(int* in, int size){

  for (int i = 0; i < size; i++){
    
    if(i&1){ //odd
      simd_compare_and_swap_int(&in[1], size-1);
    } else { //even
      simd_compare_and_swap_int(in, size);
    }
  }

}
