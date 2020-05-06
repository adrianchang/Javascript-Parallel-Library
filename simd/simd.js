const em_module = require('./a.out.js');

// C wrappers
const simd_add_int = em_module.cwrap('simd_add_int', 'null', ['number', 'number', 'number', 'number']);
const simd_add_float = em_module.cwrap('simd_add_float', 'null', ['number', 'number', 'number', 'number']);
const simd_sub_int = em_module.cwrap('simd_sub_int', 'null', ['number', 'number', 'number', 'number']);
const simd_sub_float = em_module.cwrap('simd_sub_float', 'null', ['number', 'number', 'number', 'number']);
const simd_multiply_int = em_module.cwrap('simd_multiply_int', 'null', ['number', 'number', 'number', 'number']);
const simd_multiply_float = em_module.cwrap('simd_multiply_float', 'null', ['number', 'number', 'number', 'number']);
const simd_div_float = em_module.cwrap('simd_div_float', 'null', ['number', 'number', 'number', 'number']);
const simd_min_int = em_module.cwrap('simd_min_int', 'null', ['number', 'number', 'number', 'number']);
const simd_min_float = em_module.cwrap('simd_min_float', 'null', ['number', 'number', 'number', 'number']);
const simd_max_int = em_module.cwrap('simd_max_int', 'null', ['number', 'number', 'number', 'number']);
const simd_max_float = em_module.cwrap('simd_max_float', 'null', ['number', 'number', 'number', 'number']);
const simd_odd_even_sort_int = em_module.cwrap('simd_odd_even_sort_int', 'null', ['number', 'number']);
const simd_aa_sort = em_module.cwrap('simd_aa_sort', 'null', ['number', 'number']);


/***************** simd datatype basic function *********************************************************/

/* Set the arr in the shared heap space
   Parameter: Int32Array arr
   Return: pointer of the arr(offset in the shared heap space)
*/
function simd_new_int_array(arr) {
  const bytes_per_element = 4;
  const length = arr.length;

  let arr_pointer = em_module._malloc(length*bytes_per_element);
  //HEAP32 views the heap as 32Bytes a slot. Thus, to set it, we need to divide it by bytes_per_element to get the correct 
  //offset in HEAP32 space
  em_module.HEAP32.set(arr, arr_pointer/bytes_per_element);

  return arr_pointer;
}

/* Set the value in arr to arr_pointer in the shared heap space
   Parameter: Int32Array arr, arr_pointer return by function simd_new_int_array
*/
function simd_set_value_to_int_array(arr, arr_pointer) {
  const bytes_per_element = 4;
  em_module.HEAP32.set(arr, arr_pointer/bytes_per_element);
  return;
}

/* Set the arr in the shared heap space
   Parameter: Float32Array arr
   Return: pointer of the arr(offset in the shared heap space)
*/
function simd_new_float_array(arr) {
  const bytes_per_element = 4;
  const length = arr.length;

  let arr_pointer = em_module._malloc(length*bytes_per_element);
  //HEAP32 views the heap as 32Bytes a slot. Thus, to set it, we need to divide it by bytes_per_element to get the correct 
  //offset in HEAP32 space
  em_module.HEAPF32.set(arr, arr_pointer/bytes_per_element);

  return arr_pointer;
}

/* Set the value in arr to arr_pointer in the shared heap space
   Parameter: Float32Array arr, arr_pointer return by function simd_new_float_array
*/

function simd_set_value_to_float_array(arr, arr_pointer) {
  const bytes_per_element = 4;
  em_module.HEAPF32.set(arr, arr_pointer/bytes_per_element);

  return;
}

/* Delete the arr in the shared heap space
   Parameter: offset of the arr in shared heap space
   Return void
*/
function simd_delete_int_array(arr_pointer) {
  em_module._free(a_pointer);
}

function simd_int_pointer_to_int32_arr(arr_pointer, length) {
  return new Int32Array(em_module.HEAP32.buffer, arr_pointer, length);
}

function simd_float_pointer_to_float32_arr(arr_pointer, length) {
  return new Float32Array(em_module.HEAP32.buffer, arr_pointer, length);
}

/***************** simd datatype basic operation function *********************************************************/

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_add_int_array(a_pointer, b_pointer, c_pointer, length) {
  simd_add_int(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_add_float_array(a_pointer, b_pointer, c_pointer, length) {
  simd_add_float(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_sub_int_array(a_pointer, b_pointer, c_pointer, length) {
  simd_sub_int(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_sub_float_array(a_pointer, b_pointer, c_pointer, length) {
  simd_sub_float(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_multiply_int_array(a_pointer, b_pointer, c_pointer, length) {
  simd_multiply_int(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_multiply_float_array(a_pointer, b_pointer, c_pointer, length){
  simd_multiply_float(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_div_float_array(a_pointer, b_pointer, c_pointer, length){
  simd_div_float(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_min_int_array(a_pointer, b_pointer, c_pointer, length) {
  simd_min_int(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_min_float_array(a_pointer, b_pointer, c_pointer, length) {
  simd_min_float(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_max_int_array(a_pointer, b_pointer, c_pointer, length) {
  simd_max_int(a_pointer, b_pointer, c_pointer, length);
}

/* Parameter: a b c pointer in the shared heap space
   Return: void
*/
function simd_max_float_array(a_pointer, b_pointer, c_pointer, length) {
  simd_max_float(a_pointer, b_pointer, c_pointer, length);
}

function simd_odd_even_sort_int_array(a_pointer, length){
  simd_odd_even_sort_int(a_pointer, length);
}

function simd_aa_sort_int(a_pointer, length){
  simd_aa_sort(a_pointer, length);
}

module.exports = {
  simd_new_int_array : simd_new_int_array,
  simd_set_value_to_int_array : simd_set_value_to_int_array,
  simd_new_float_array : simd_new_float_array,
  simd_set_value_to_float_array : simd_set_value_to_float_array,
  simd_delete_int_array : simd_delete_int_array,
  simd_int_pointer_to_int32_arr : simd_int_pointer_to_int32_arr,
  simd_float_pointer_to_float32_arr : simd_float_pointer_to_float32_arr,
  simd_add_int_array : simd_add_int_array,
  simd_add_float_array : simd_add_float_array,
  simd_sub_int_array : simd_sub_int_array,
  simd_sub_float_array : simd_sub_float_array,
  simd_multiply_int_array : simd_multiply_int_array,
  simd_multiply_float_array : simd_multiply_float_array,
  simd_div_float_array : simd_div_float_array,
  simd_min_int_array : simd_min_int_array,
  simd_min_float_array : simd_min_float_array,
  simd_max_int_array : simd_max_int_array,
  simd_max_float_array : simd_max_float_array,
  simd_odd_even_sort_int : simd_odd_even_sort_int_array,
  simd_aa_sort_int : simd_aa_sort_int
}