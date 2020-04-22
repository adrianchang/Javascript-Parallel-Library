const simd_operations = require('./simd.js');
const em_module = require('./a.out.js');
const process = require('process');

/***************** Benchmark Helper functions *********************************************************/

function init_arr_i(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = i;
	}
}

function initI_arr_plus_one(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = i + 1;
	}
}

function init_zero(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = 0.0;
	}
}

function check_array_add_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - b[i] - a[i]) > 0.01) {
			console.log(a[i] + " + " + b[i] + " = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_multiply_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - a[i]*b[i]) > 0.01) {
			console.log(a[i] + " * " + b[i] + " = " + c[i]);
			return false;
		}
	}
	return true;
}

/***************** SIMD benchmarks *********************************************************/

function sim_int_aray_add_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		simd_operations.sim_add_int_aray(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_add_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_aray_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_aray_add_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_aray_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_aray_add_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);
	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();
		simd_operations.sim_add_float_aray(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_add_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_aray_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_aray_add_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_aray_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_int_aray_multiply_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		simd_operations.sim_multiply_int_aray(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_multiply_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_aray_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_aray_multiply_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_aray_multiply_benchmark Execution time (hr): %ds', amount_time/iteration);
}

/***************** Baseline benchmarks *********************************************************/

function baseline_int_aray_add_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] + b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline sim_int_aray_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline sim_int_aray_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_float_aray_add_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] + b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline sim_float_aray_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline sim_float_aray_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_int_aray_multiply_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] * b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline sim_int_aray_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline sim_int_aray_multiply_benchmark Execution time (hr): %ds', amount_time/iteration);
}

/***************** Compare benchmarks *********************************************************/

function int_add_arry_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_int_aray_add_benchmark(length, iteration);
	baseline_int_aray_add_benchmark(length, iteration);
}

function float_add_arry_benchmark() {
	let length = 100000;
	let iteration = 10;
	sim_float_aray_add_benchmark(length, iteration);
	baseline_float_aray_add_benchmark(length, iteration);
}

function int_multiply_arry_benchmark() {
	let length = 10000;
	let iteration = 10;
	sim_int_aray_multiply_benchmark(length, iteration);
	baseline_int_aray_multiply_benchmark(length, iteration);
}

em_module.onRuntimeInitialized = () => {
	int_add_arry_benchmark();
	float_add_arry_benchmark();
	int_multiply_arry_benchmark();
}
