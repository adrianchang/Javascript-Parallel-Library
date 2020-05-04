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

function init_random_int(arr){
	for (let i = 0; i<arr.length; i++){
		arr[i] = Math.floor(Math.random()*1000);
	}
}

function init_random_float(arr){
	for (let i = 0; i<arr.length; i++){
		arr[i] = Math.random()*1000;
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

function check_array_sub_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] + b[i] - a[i]) > 0.01) {
			console.log(a[i] + " - " + b[i] + " = " + c[i]);
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

function check_array_div_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - a[i]/b[i]) > 0.01) {
			console.log(a[i] + " / " + b[i] + " = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_min_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - Math.min(a[i], b[i])) > 0.01) {
			console.log( "min (" + a[i] + ", " + b[i] + ") = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_max_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - Math.max(a[i], b[i])) > 0.01) {
			console.log( "max (" + a[i] + ", " + b[i] + ") = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_sort_correctness(a, b, length){
	a.sort();
	for (let i = 0; i < length; i++){
		if(a[i]!=b[i]){
			console.log(i);
			return false;
		}
	}
	return true;
}

/***************** SIMD benchmarks *********************************************************/

function sim_int_array_add_benchmark(length, iteration) {
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

		simd_operations.sim_add_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_add_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_array_add_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_array_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_array_add_benchmark(length, iteration) {
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
		simd_operations.sim_add_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_add_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_array_add_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_array_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}


function sim_int_array_sub_benchmark(length, iteration) {
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

		simd_operations.sim_sub_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_sub_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_array_sub_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_array_sub_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_array_sub_benchmark(length, iteration) {
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
		simd_operations.sim_sub_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_sub_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_array_sub_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_array_sub_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_int_array_multiply_benchmark(length, iteration) {
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

		simd_operations.sim_multiply_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_multiply_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_array_multiply_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_array_multiply_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_array_multiply_benchmark(length, iteration) {
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

		simd_operations.sim_multiply_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_multiply_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_array_multiply_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_array_multiply_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_array_div_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_random_float(a);
	init_random_float(b);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		let hrstart = process.hrtime();

		simd_operations.sim_div_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_div_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_array_div_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_array_div_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_array_div_benchmark Execution time (hr): %ds', amount_time/iteration);
}



function sim_int_array_min_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_random_int(a);
	init_random_int(b);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		simd_operations.sim_min_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_min_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_array_min_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_array_min_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_array_min_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_random_float(a);
	init_random_float(b);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		let hrstart = process.hrtime();

		simd_operations.sim_min_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_min_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_array_min_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_array_min_benchmark Execution time (hr): %ds', amount_time/iteration);
}


function sim_int_array_max_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_random_int(a);
	init_random_int(b);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		simd_operations.sim_max_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_max_correctness(a, b, c, length)) {
			console.info('Benchmark sim_int_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_array_max_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_array_max_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_float_array_max_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_random_float(a);
	init_random_float(b);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		let hrstart = process.hrtime();

		simd_operations.sim_max_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_max_correctness(a, b, c, length)) {
			console.info('Benchmark sim_float_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_float_array_max_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_float_array_max_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function sim_int_sort_array_benchmark(length, iteration){

	let a = new Int32Array(length);

	init_random_int(a);
	let a_pointer = simd_operations.simd_new_int_array(a);
	
	let amount_time = 0;

	for (let i = 0; i < iteration; i++) {


		let hrstart = process.hrtime();

		simd_operations.simd_aa_sort_int(a_pointer, length);

		let hrend = process.hrtime(hrstart);
		let b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000;

		if (check_array_sort_correctness(a, b, length)) {
			console.info('Benchmark sim_int_sort_array_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
		}else {
			console.log("Benchmark sim_int_sort_array_benchmark calculation error");
		}
	}

	console.info('Benchmark sim_int_sort_array_benchmark Execution time (hr): %ds', amount_time/iteration);

}

/***************** Baseline benchmarks *********************************************************/

function baseline_int_array_add_benchmark(length, iteration) {
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

		console.info('Baseline sim_int_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline sim_int_array_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_float_array_add_benchmark(length, iteration) {
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

		console.info('Baseline sim_float_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline sim_float_array_add_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_int_array_sub_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] - b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_int_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_int_array_sub_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_float_array_sub_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_arr_i(a);
	initI_arr_plus_one(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] - b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_float_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_float_array_sub_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_int_array_multiply_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

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

		console.info('Baseline sim_int_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline sim_int_array_multiply_benchmark Execution time (hr): %ds', amount_time/iteration);
}


function baseline_float_array_multiply_benchmark(length, iteration) {
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

		console.info('Baseline baseline_float_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_float_array_multiply_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_float_array_div_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_random_float(a);
	init_random_float(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] / b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_float_array_div_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_float_array_div_benchmark Execution time (hr): %ds', amount_time/iteration);
}


function baseline_int_array_min_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_random_int(a);
	init_random_int(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.min(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_int_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_int_array_min_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_float_array_min_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_random_float(a);
	init_random_float(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.min(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_float_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_float_array_min_benchmark Execution time (hr): %ds', amount_time/iteration);
}



function baseline_int_array_max_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);	
	let c = new Int32Array(length);	

	init_random_int(a);
	init_random_int(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.max(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_int_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_int_array_max_benchmark Execution time (hr): %ds', amount_time/iteration);
}

function baseline_float_array_max_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);	
	let c = new Float32Array(length);	

	init_random_float(a);
	init_random_float(b);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.min(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_float_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_float_array_max_benchmark Execution time (hr): %ds', amount_time/iteration);
}


function baseline_int_array_sort_benchmark(length, iteration) {

	let a = new Int32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		let hrstart = process.hrtime();

		a.sort();
		//a.sort(function(a, b){return a-b});
		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000;

		console.info('Baseline baseline_int_array_sort_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000);
	}

	console.info('Baseline baseline_int_array_sort_benchmark Execution time (hr): %ds', amount_time/iteration);
}


/***************** Compare benchmarks *********************************************************/

function int_add_array_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_int_array_add_benchmark(length, iteration);
	baseline_int_array_add_benchmark(length, iteration);
}

function float_add_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	sim_float_array_add_benchmark(length, iteration);
	baseline_float_array_add_benchmark(length, iteration);
}

function int_sub_array_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_int_array_sub_benchmark(length, iteration);
	baseline_int_array_sub_benchmark(length, iteration);
}

function float_sub_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	sim_float_array_sub_benchmark(length, iteration);
	baseline_float_array_sub_benchmark(length, iteration);
}

function int_multiply_array_benchmark() {
	let length = 10000;
	let iteration = 10;
	sim_int_array_multiply_benchmark(length, iteration);
	baseline_int_array_multiply_benchmark(length, iteration);
}

function float_multiply_array_benchmark(){
	let length = 1000;
	let iteration = 10;
	sim_float_array_multiply_benchmark(length, iteration);
	baseline_float_array_multiply_benchmark(length, iteration);
}


function float_div_array_benchmark(){
	let length = 1000;
	let iteration = 10;
	sim_float_array_div_benchmark(length, iteration);
	baseline_float_array_div_benchmark(length, iteration);
}

function int_min_array_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_int_array_min_benchmark(length, iteration);
	baseline_int_array_min_benchmark(length, iteration);
}

function float_min_array_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_float_array_min_benchmark(length, iteration);
	baseline_float_array_min_benchmark(length, iteration);
}

function int_max_array_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_int_array_max_benchmark(length, iteration);
	baseline_int_array_max_benchmark(length, iteration);
}

function float_max_array_benchmark() {
	let length = 10000000;
	let iteration = 10;
	sim_float_array_max_benchmark(length, iteration);
	baseline_float_array_max_benchmark(length, iteration);
}

function int_sort_array_benchmark(){
	let length = Math.pow(2, 20);
	let iteration = 10;
	sim_int_sort_array_benchmark(length, iteration);
	baseline_int_array_sort_benchmark(length, iteration);
}

function checkIdentical(arr, origin, length) {
	for(let i = 0; i < length; i++) {
		// console.log(origin[i] + " " + arr[i]);
		if(origin[i] != arr[i]) {
			return false;
		}
	}
	return true;
}

//Below are all tests

function simd_int_pointer_to_int32_arr_test() {
	let msg = "not sorted";
	let length = 4;
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let ans = [1, 2, 3, 4];

	a = [1,2,3,4];
	let a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [2,1,3,4];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [3,1,2,4];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [1,3,2,4];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [2,3,1,4];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [3,2,1,4];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [3,2,4,1];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [2,3,4,1];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [4,3,2,1];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [3,4,2,1]
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [2,4,3,1];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [4,2,3,1];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [4,1,3,2];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [1,4,3,2];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [3,4,1,2];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [4,3,1,2];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [1,3,4,2];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [3,1,4,2];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [2,1,4,3];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [1,2,4,3];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [4,2,1,3];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [2,4,1,3];
	 a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [1,4,2,3];
	a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	a = [4,1,2,3];
	a_pointer = simd_operations.simd_new_int_array(a);
	simd_operations.simd_sort_int_vecotr(a_pointer, length);
	b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	if (!checkIdentical(ans, b, length)) {
		console.log(msg);
	}
	// console.log(checkIdentical(ans, b, length));
}

function simd_compswap_int_test() {
	let length = 4;
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	a = [2, 3, 6, 1];
	b = [-1, 1, 3, 3];
	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);

	simd_operations.simd_compswap_int(a_pointer, b_pointer);

	a = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	b = simd_operations.simd_int_pointer_to_int32_arr(b_pointer);
	if (!checkIdentical(a, [-1, 1, 3, 1], 4)) {
		console.log("simd_compswap_int error a");
	}
	if (!checkIdentical(b, [2, 3, 6, 3], 4)) {
		console.log("simd_compswap_int error b");
	}
}

function simd_skew_compswap_int_test() {
	let length = 4;
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	a = [2, 3, 6, 1];
	b = [-1, 1, 3, 3];
	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);

	simd_operations.simd_skew_compswap_int(a_pointer, b_pointer);

	a = simd_operations.simd_int_pointer_to_int32_arr(a_pointer);
	b = simd_operations.simd_int_pointer_to_int32_arr(b_pointer);

	if (!checkIdentical(a, [1, 3, 3, 1], 4)) {
		console.log("simd_compswap_int error a");
	}
	if (!checkIdentical(b, [-1, 2, 3, 6], 4)) {
		console.log("simd_compswap_int error b");
	}
}


em_module.onRuntimeInitialized = () => {
	//TODO add delete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// int_add_array_benchmark();
	// float_add_array_benchmark();
	// int_sub_array_benchmark();
	// float_sub_array_benchmark();
	// int_multiply_array_benchmark();
	// float_multiply_array_benchmark();
	// float_div_array_benchmark();
	// int_min_array_benchmark();
	// float_min_array_benchmark();
	// int_max_array_benchmark();
	// float_max_array_benchmark();
	int_sort_array_benchmark();

 //Tests
//  simd_int_pointer_to_int32_arr_test();
//  simd_compswap_int_test();
//  simd_skew_compswap_int_test();

//  simd_comb_sort_int();

}
