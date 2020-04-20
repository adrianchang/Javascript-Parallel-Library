const em_module = require('./a.out.js');

function runSimdFloatAdd() {
	const simdFloatAdd = em_module.cwrap('simdFloatAdd', 'null', ['number', 'number', 'number', 'number']);

  	var a = [];
  	var b = [];
  	var c = [];
  	const length = 800000;
  	for (var i = 0.0; i < length; i++) {
  		a.push(i);
  		b.push(i + 1);
  		c.push(0.0);
  	}

  	simdFloatAdd(a, b, c, length);
}

function runSimdIntAdd() {
	const simdIntAdd = em_module.cwrap('simdIntAdd', 'null', ['number', 'number', 'number', 'number']);

  	const length = 8000;
  	const bytes_per_element = 4;
  	var a = new Int32Array(length);
  	var b = new Int32Array(length);
  	var c = new Int32Array(length);

  	initI(a);
  	initIPlusOne(b);
  	initZero(c);

	var a_pointer = em_module._malloc(length*bytes_per_element);
	var b_pointer = em_module._malloc(length*bytes_per_element);
	var c_pointer = em_module._malloc(length*bytes_per_element);

	em_module.HEAP32.set(a, a_pointer/bytes_per_element);
	em_module.HEAP32.set(b, b_pointer/bytes_per_element);

  	simdIntAdd(a_pointer, b_pointer, c_pointer, length);
	
	var c = new Int32Array(em_module.HEAP32.buffer, c_pointer, length);

  	for (var i = 0; i < length; i++) {
  		if (a[i] + b[i] != c[i]) {
  			console.log("simdIntAdd calculation error");
  		}
  	}
  	
  	em_module._free(a_pointer);
	em_module._free(b_pointer);
	em_module._free(c_pointer);
}

function multiply_arrays(argument) {
	const c_multiply_arrays = em_module.cwrap('multiply_arrays', 'null', ['number', 'number', 'number', 'number']);

  	const length = 8000;
  	const bytes_per_element = 4;
  	var a = new Int32Array(length);
  	var b = new Int32Array(length);
  	var c = new Int32Array(length);

  	initI(a);
  	initIPlusOne(b);
  	initZero(c);

	var a_pointer = em_module._malloc(length*bytes_per_element);
	var b_pointer = em_module._malloc(length*bytes_per_element);
	var c_pointer = em_module._malloc(length*bytes_per_element);

	em_module.HEAP32.set(a, a_pointer/bytes_per_element);
	em_module.HEAP32.set(b, b_pointer/bytes_per_element);

  	c_multiply_arrays(a_pointer, b_pointer, c_pointer, length);

  	em_module._free(a_pointer);
	em_module._free(b_pointer);
	em_module._free(c_pointer);
}

function initI(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = i;
	}
}

function initIPlusOne(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = i + 1;
	}
}

function initZero(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = 0;
	}
}

em_module.onRuntimeInitialized = runSimdIntAdd;