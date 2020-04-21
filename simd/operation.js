const em_module = require('./a.out.js');

// C wrappers
const simd_int_add = em_module.cwrap('simdIntAdd', 'null', ['number', 'number', 'number', 'number']);


/* Parameter: Int32Array a, b 
   Return: Int32Array
   a and b need to be the same length
*/
function sim_int_aray_add(a, b) {
  const bytes_per_element = 4;

  const length = a.length;

  let a_pointer = em_module._malloc(length*bytes_per_element);
  let b_pointer = em_module._malloc(length*bytes_per_element);
  let c_pointer = em_module._malloc(length*bytes_per_element);

  //HEAP32 views the heap as 32Bytes a slot. Thus, to set it, we need to divide it by bytes_per_element to get the correct 
  //offset in HEAP32 space
  em_module.HEAP32.set(a, a_pointer/bytes_per_element);
  em_module.HEAP32.set(b, b_pointer/bytes_per_element);

  simd_int_add(a_pointer, b_pointer, c_pointer, length);
  
  let c = new Int32Array(em_module.HEAP32.buffer, c_pointer, length);

  em_module._free(a_pointer);
  em_module._free(b_pointer);
  em_module._free(c_pointer);

  return c;
}

exports.sim_int_aray_add = sim_int_aray_add;