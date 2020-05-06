#include <wasm_simd128.h>
#include <emscripten.h>
#include <stdio.h> 
#include <stdlib.h>
#include <pthread.h>

#define MAX_THREAD 8
#define MIN_BLOCK_SIZE 65536

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

void EMSCRIPTEN_KEEPALIVE simd_odd_even_sort_int(int* in, int size){

  for (int i = 0; i < size; i++){
    
    if(i&1){ //odd
      simd_compare_and_swap_int(&in[1], size-1);
    } else { //even
      simd_compare_and_swap_int(in, size);
    }
  }

}

void aa_vector_sort(v128_t* input, int size) {
  v128_t swapped = wasm_v32x4_shuffle(*input, *input, 1, 0, 3, 2);
  v128_t compare = wasm_i32x4_lt(*input, swapped);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(1, 0, 1, 0));
  *input = wasm_v128_bitselect(swapped, *input, compare);

  //Second layer 0<->2 1<->3
  swapped = wasm_v32x4_shuffle(*input, *input, 2, 3, 0, 1);
  compare = wasm_i32x4_lt(*input, swapped);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(1, 1, 0, 0));
  *input = wasm_v128_bitselect(swapped, *input, compare);

  //Third layer 1<->2 
  swapped = wasm_v32x4_shuffle(*input, *input, 0, 2, 1, 3);
  compare = wasm_i32x4_lt(*input, swapped);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(0, 1, 0, 0));
  *input = wasm_v128_bitselect(swapped, *input, compare);
}

// Take in two int array of size 4
bool aa_vector_cmpswap(v128_t* vector_a, v128_t* vector_b){
  v128_t compare = wasm_i32x4_gt(*vector_a, *vector_b);
  v128_t swapped_vector_a = wasm_v128_bitselect(*vector_b, *vector_a, compare);
  v128_t not_compare = wasm_v128_not(compare);
  v128_t swapped_vector_b = wasm_v128_bitselect(*vector_b, *vector_a, not_compare);

  v128_t changes = wasm_i32x4_ne(*vector_a, swapped_vector_a);
  bool has_changes = wasm_i32x4_any_true(changes);

  *vector_a = swapped_vector_a;
  *vector_b = swapped_vector_b;

  return has_changes;
}

// Take in two int array of size 4
bool EMSCRIPTEN_KEEPALIVE aa_vector_skew_cmpswap(v128_t* vector_a, v128_t* vector_b){
  v128_t skew_b = wasm_v32x4_shuffle(*vector_b, *vector_b, 1, 2, 3, 0);

  v128_t compare = wasm_i32x4_gt(*vector_a, skew_b);
  compare = wasm_v128_and(compare, wasm_i32x4_make(__INT32_MAX__, __INT32_MAX__, __INT32_MAX__, 0));
  v128_t swapped_vector_a = wasm_v128_bitselect(skew_b, *vector_a, compare);

  v128_t not_compare = wasm_v128_not(compare);
  compare = wasm_v128_or(compare, wasm_i32x4_make(0, 0, 0, -1));
  v128_t swapped_vector_b = wasm_v128_bitselect(skew_b, *vector_a, not_compare);
  swapped_vector_b = wasm_v32x4_shuffle(swapped_vector_b, swapped_vector_b, 3, 0, 1, 2);

  v128_t changes = wasm_i32x4_ne(*vector_a, swapped_vector_a);
  bool has_changes = wasm_i32x4_any_true(changes);

  *vector_a = swapped_vector_a;
  *vector_b = swapped_vector_b;

  return has_changes;
}



void EMSCRIPTEN_KEEPALIVE simd_comb_sort(int* arr, int length){
  // Step one
  // Load input into array of vectors and sort every small vector.
  int numVectors = (length+15)/16*4;
  const float SHRINK_FACTOR = 1.3;
  int i = 0;
  v128_t* vectors = malloc(sizeof(v128_t) * numVectors);
  for (i = 0; i < numVectors; i++) {
    if(i*4 + 4 > length){
      int padded[4] = {__INT32_MAX__, __INT32_MAX__, __INT32_MAX__, __INT32_MAX__};
      for(int j=0; j<length-i*4; j++){
        padded[j] = arr[i*4+j];
      }
      vectors[i] = wasm_v128_load(padded);
    } else {
      vectors[i] = wasm_v128_load(&arr[i*4]);
    }
    aa_vector_sort(&vectors[i], 4);
  }

  // Step two
  // Keep doing swap with a gap(comparing unadajenct vectors) till there's no updates
  int gap = numVectors/SHRINK_FACTOR;
  while(gap > 1) {
    for (i = 0; i < numVectors - gap; i++) {
      aa_vector_cmpswap(&vectors[i], &vectors[i + gap]);
    } 
    for (i = numVectors - gap; i < numVectors; i++) {
      aa_vector_skew_cmpswap(&vectors[i], &vectors[i + gap - numVectors]);
    } 
    gap /= SHRINK_FACTOR;
  }

  bool has_changes = false;
  do {
    has_changes = false;

    for (i = 0; i < numVectors - 1; i++) {
      has_changes |= aa_vector_cmpswap(&vectors[i], &vectors[i + 1]);
    }  
    has_changes |= aa_vector_skew_cmpswap(&vectors[numVectors - 1], &vectors[0]);
  }while(has_changes);

  //Step three
  int numBlocks = numVectors/4;
  int i0 = 0;
  int i1 = i0 + numBlocks;
  int i2 = i1 + numBlocks;
  int i3 = i2 + numBlocks;
  for (i = 0; i < numVectors; i += 4) {
    //Do 4x4 transpose
    v128_t temp0 = wasm_v32x4_shuffle(vectors[i], vectors[i + 1], 0, 1, 4, 5);
    v128_t temp2 = wasm_v32x4_shuffle(vectors[i], vectors[i + 1], 2, 3, 6, 7);
    v128_t temp1 = wasm_v32x4_shuffle(vectors[i + 2], vectors[i + 3], 0, 1, 4, 5);
    v128_t temp3 = wasm_v32x4_shuffle(vectors[i + 2], vectors[i + 3], 2, 3, 6, 7);

    vectors[i] = wasm_v32x4_shuffle(temp0, temp1, 0, 2, 4, 6);
    vectors[i + 1] = wasm_v32x4_shuffle(temp0, temp1, 1, 3, 5, 7);
    vectors[i + 2] = wasm_v32x4_shuffle(temp2, temp3, 0, 2, 4, 6);
    vectors[i + 3] = wasm_v32x4_shuffle(temp2, temp3, 1, 3, 5, 7);

    // Calculate the right position for the transposed rows
    // The basic idea is that there are for lanes each is #numBlocks of rows away
    wasm_v128_store(&arr[i0*4], vectors[i]); 
    wasm_v128_store(&arr[i1*4], vectors[i + 1]); 
    wasm_v128_store(&arr[i2*4], vectors[i + 2]); 
    wasm_v128_store(&arr[i3*4], vectors[i + 3]);
    i0++;
    i1++;
    i2++;
    i3++; 
  }
}


// Take in int array of size 4
void EMSCRIPTEN_KEEPALIVE simd_int_vector_sort(int* in, int size){
  //First layer 0<->1 2<->3
  v128_t input = wasm_v128_load(&in[0]);
  aa_vector_sort(&input, size);
  wasm_v128_store(&in[0], input);
}

// Take in two int array of size 4
void EMSCRIPTEN_KEEPALIVE simd_vector_cmpswap(int* a, int* b){
  v128_t vector_a = wasm_v128_load(a);
  v128_t vector_b = wasm_v128_load(b);

  aa_vector_cmpswap(&vector_a, &vector_b);

  wasm_v128_store(a, vector_a);
  wasm_v128_store(b, vector_b);

}

// Take in two int array of size 4
void EMSCRIPTEN_KEEPALIVE simd_vector_skew_cmpswap(int* a, int* b){

  v128_t vector_a = wasm_v128_load(a);
  v128_t vector_b = wasm_v128_load(b);

  aa_vector_skew_cmpswap(&vector_a, &vector_b);

  wasm_v128_store(a, vector_a);
  wasm_v128_store(b, vector_b);
}


void EMSCRIPTEN_KEEPALIVE simd_vector_merge(v128_t* vector_a_ptr, v128_t* vector_b_ptr){

  v128_t vector_a = *vector_a_ptr;
  v128_t vector_b = *vector_b_ptr;

  // Step 1
  v128_t comb_a = wasm_v32x4_shuffle(vector_a, vector_b, 0, 4, 1, 5);
  v128_t comb_a_swap = wasm_v32x4_shuffle(comb_a, comb_a, 1, 0, 3, 2);
  v128_t comb_b = wasm_v32x4_shuffle(vector_a, vector_b, 2, 6, 3, 7);
  v128_t comb_b_swap = wasm_v32x4_shuffle(comb_b, comb_b, 1, 0, 3, 2);

  v128_t compare = wasm_i32x4_lt(comb_a, comb_a_swap);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(1, 0, 1, 0));
  vector_a = wasm_v128_bitselect(comb_a_swap, comb_a, compare);

  compare = wasm_i32x4_lt(comb_b, comb_b_swap);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(1, 0, 1, 0));
  vector_b = wasm_v128_bitselect(comb_b_swap, comb_b, compare); 

  // Step 2
  comb_a = wasm_v32x4_shuffle(vector_a, vector_b, 0, 1, 4, 5);
  comb_a_swap = wasm_v32x4_shuffle(comb_a, comb_a, 0, 2, 1, 3);
  comb_b = wasm_v32x4_shuffle(vector_a, vector_b, 2, 3, 6, 7);
  comb_b_swap = wasm_v32x4_shuffle(comb_b, comb_b, 0, 2, 1, 3);

  compare = wasm_i32x4_lt(comb_a, comb_a_swap);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(0, 1, 0, 0));
  vector_a = wasm_v128_bitselect(comb_a_swap, comb_a, compare);

  compare = wasm_i32x4_lt(comb_b, comb_b_swap);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(0, 1, 0, 0));
  vector_b = wasm_v128_bitselect(comb_b_swap, comb_b, compare);

  // Step 3
  comb_a = wasm_v32x4_shuffle(vector_a, vector_b, 0, 1, 4, 2);
  comb_a_swap = wasm_v32x4_shuffle(vector_a, vector_b, 0, 4, 1, 5);
  comb_b = wasm_v32x4_shuffle(vector_a, vector_b, 2, 3, 6, 7);
  comb_b_swap = wasm_v32x4_shuffle(vector_a, vector_b, 5, 6, 3, 7);  

  compare = wasm_i32x4_lt(comb_a, comb_a_swap);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(0, 1, 0, 1));
  vector_a = wasm_v128_bitselect(comb_a_swap, comb_a, compare); 

  compare = wasm_i32x4_lt(comb_b, comb_b_swap);
  compare = wasm_i32x4_ne(wasm_i32x4_abs(compare), wasm_i32x4_make(0, 1, 0, 0));
  vector_b = wasm_v128_bitselect(comb_b_swap, comb_b, compare);

  *vector_a_ptr = vector_a;
  *vector_b_ptr = vector_b;
}


void EMSCRIPTEN_KEEPALIVE simd_merge_sorted_array(int* a, int* b, int a_len, int b_len, int* mergedArray){

  v128_t vMin = wasm_v128_load(a);
  v128_t vMax = wasm_v128_load(b);

  int aPos = 4;
  int bPos = 4;
  int mergedArrayPos = 0;

  while(aPos < a_len && bPos < b_len){

    simd_vector_merge(&vMin, &vMax);
    wasm_v128_store(mergedArray+mergedArrayPos, vMin);
    mergedArrayPos += 4;

    if(a[aPos] < b[bPos]){
      vMin = wasm_v128_load(a+aPos);
      aPos += 4;
    } else {
      vMin = wasm_v128_load(b+bPos);
      bPos += 4;
    }

  }

  while(aPos < a_len){
    simd_vector_merge(&vMin, &vMax);
    wasm_v128_store(mergedArray+mergedArrayPos, vMin);
    mergedArrayPos += 4;
    vMin = wasm_v128_load(a+aPos);
    aPos += 4;
  }

  while(bPos < b_len){
    simd_vector_merge(&vMin, &vMax);
    wasm_v128_store(mergedArray+mergedArrayPos, vMin);
    mergedArrayPos += 4;
    vMin = wasm_v128_load(b+bPos);
    bPos += 4;
  }

  simd_vector_merge(&vMin, &vMax);
  wasm_v128_store(mergedArray+mergedArrayPos, vMin);
  wasm_v128_store(mergedArray+mergedArrayPos+4, vMax);
}


void EMSCRIPTEN_KEEPALIVE simd_merge_sort(int* arr, int length, int block_size){

  int merge_length = block_size;
  int out_length = block_size * 2;
  int* tmp_ptr;
  int* origin_arr_ptr = arr;

  int* sortedArray = malloc(sizeof(int) * length);

  while(out_length <= length){
    for(int i=0; i<length; i+=out_length){
      
      int first_array_len = merge_length;
      int second_array_len = merge_length > (length-i) ? (length-i) : merge_length;
      int *first_array = arr+i;
      int *second_array = arr+i+first_array_len;

      simd_merge_sorted_array(first_array, second_array, first_array_len, second_array_len, sortedArray+i);
    }

    merge_length *= 2;
    out_length *= 2;
    tmp_ptr = arr;
    arr = sortedArray;
    sortedArray = tmp_ptr;    
  }

  if(arr!=origin_arr_ptr){
    for(int i=0; i<length; i+=4){
      wasm_v128_store(origin_arr_ptr+i, wasm_v128_load(arr+i));
    }
    free(arr);
  } else {
    free(sortedArray);
  }
}

typedef struct arrInfo {

  int * arr;
  int length;

} arrInfo;

void* comb_sort_thread(void* arg) {

  arrInfo *arr_info = (arrInfo*) arg;

  int *arr = arr_info->arr;
  int length = arr_info->length;

  simd_comb_sort(arr, length);
  return arg;
}

void EMSCRIPTEN_KEEPALIVE simd_aa_sort(int* arr, int length){

  if(length > MIN_BLOCK_SIZE){
    pthread_t threads[MAX_THREAD];
    int block_size = (length + MAX_THREAD - 1) / MAX_THREAD;

    for (int i = 0; i < MAX_THREAD; i++){
      arrInfo *arr_info = malloc(sizeof(arrInfo));
      arr_info->arr = arr + i * block_size;
      arr_info->length = block_size > length-i ? length - i : block_size;
      if(arr_info->length > 0){
        pthread_create(&threads[i], NULL, comb_sort_thread, (void*) arr_info);
      }
    }

    for (int i = 0; i < MAX_THREAD; i++){
      pthread_join(threads[i], NULL); 
    }
    simd_merge_sort(arr, length, block_size);

  } else {
    simd_comb_sort(arr, length);
  }

}














