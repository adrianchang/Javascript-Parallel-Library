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

function init_random_int(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = Math.floor(Math.random() * 500);
	}
}

function init_random_float(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = Math.random() * 500;
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
		if (Math.abs(c[i] - a[i] * b[i]) > 0.01) {
			console.log(a[i] + " * " + b[i] + " = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_min_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - Math.min(a[i], b[i])) > 0.01) {
			console.log("min (" + a[i] + ", " + b[i] + ") = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_max_correctness(a, b, c, length) {
	for (let i = 0; i < length; i++) {
		if (Math.abs(c[i] - Math.max(a[i], b[i])) > 0.01) {
			console.log("max (" + a[i] + ", " + b[i] + ") = " + c[i]);
			return false;
		}
	}
	return true;
}

function check_array_sort_correctness(a, b, length) {
	a.sort();
	for (let i = 0; i < length; i++) {
		if (a[i] != b[i]) {
			console.log(i);
			return false;
		}
	}
	return true;
}

/***************** SIMD benchmarks *********************************************************/

function simd_int_array_add_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		init_random_int(b);

		simd_operations.simd_set_value_to_int_array(a, a_pointer);
		simd_operations.simd_set_value_to_int_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_add_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_add_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_int_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_array_add_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_array_add_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_float_array_add_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);
	let amount_time = 0;

	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);
		simd_operations.simd_set_value_to_float_array(a, a_pointer);
		simd_operations.simd_set_value_to_float_array(b, b_pointer);

		let hrstart = process.hrtime();
		simd_operations.simd_add_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_add_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_float_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_float_array_add_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_float_array_add_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}


function simd_int_array_sub_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		init_random_int(b);
		simd_operations.simd_set_value_to_int_array(a, a_pointer);
		simd_operations.simd_set_value_to_int_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_sub_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_sub_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_int_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_array_sub_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_array_sub_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_float_array_sub_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_float(a);
		init_random_float(b);
		simd_operations.simd_set_value_to_float_array(a, a_pointer);
		simd_operations.simd_set_value_to_float_array(b, b_pointer);

		let hrstart = process.hrtime();
		simd_operations.simd_sub_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_sub_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_float_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_float_array_sub_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_float_array_sub_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_int_array_multiply_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		init_random_int(b);
		simd_operations.simd_set_value_to_int_array(a, a_pointer);
		simd_operations.simd_set_value_to_int_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_multiply_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_multiply_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_int_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_array_multiply_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_array_multiply_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_float_array_multiply_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_float(a);
		init_random_float(b);
		simd_operations.simd_set_value_to_float_array(a, a_pointer);
		simd_operations.simd_set_value_to_float_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_multiply_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_multiply_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_float_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_float_array_multiply_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_float_array_multiply_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}


function simd_int_array_min_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		init_random_int(b);
		simd_operations.simd_set_value_to_int_array(a, a_pointer);
		simd_operations.simd_set_value_to_int_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_min_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_min_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_int_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_array_min_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_array_min_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_float_array_min_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);
		simd_operations.simd_set_value_to_float_array(a, a_pointer);
		simd_operations.simd_set_value_to_float_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_min_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_min_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_float_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_float_array_min_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_float_array_min_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}


function simd_int_array_max_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let a_pointer = simd_operations.simd_new_int_array(a);
	let b_pointer = simd_operations.simd_new_int_array(b);
	let c_pointer = simd_operations.simd_new_int_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		init_random_int(b);
		simd_operations.simd_set_value_to_int_array(a, a_pointer);
		simd_operations.simd_set_value_to_int_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_max_int_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_int_pointer_to_int32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_max_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_int_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_array_max_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_array_max_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_float_array_max_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let a_pointer = simd_operations.simd_new_float_array(a);
	let b_pointer = simd_operations.simd_new_float_array(b);
	let c_pointer = simd_operations.simd_new_float_array(c);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);
		simd_operations.simd_set_value_to_float_array(a, a_pointer);
		simd_operations.simd_set_value_to_float_array(b, b_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_max_float_array(a_pointer, b_pointer, c_pointer, length);

		let hrend = process.hrtime(hrstart);
		c = simd_operations.simd_float_pointer_to_float32_arr(c_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_max_correctness(a, b, c, length)) {
			// console.info('Benchmark simd_float_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_float_array_max_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_float_array_max_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function simd_int_odd_even_sort_array_benchmark(length, iteration) {

	let a = new Int32Array(length);
	let a_pointer = simd_operations.simd_new_int_array(a);

	let amount_time = 0;

	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		simd_operations.simd_set_value_to_int_array(a, a_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_odd_even_sort_int(a_pointer, length);

		let hrend = process.hrtime(hrstart);
		let b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_sort_correctness(a, b, length)) {
			// console.info('Benchmark simd_int_odd_even_sort_array_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_odd_even_sort_array_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_odd_even_sort_array_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);

}

function simd_int_aa_sort_array_benchmark(length, iteration) {

	let a = new Int32Array(length);
	let a_pointer = simd_operations.simd_new_int_array(a);

	let amount_time = 0;

	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		simd_operations.simd_set_value_to_int_array(a, a_pointer);

		let hrstart = process.hrtime();

		simd_operations.simd_aa_sort_int(a_pointer, length);

		let hrend = process.hrtime(hrstart);
		let b = simd_operations.simd_int_pointer_to_int32_arr(a_pointer, length);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		if (check_array_sort_correctness(a, b, length)) {
			// console.info('Benchmark simd_int_aa_sort_array_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
		} else {
			console.log("Benchmark simd_int_aa_sort_array_benchmark calculation error");
		}
	}

	console.info('Benchmark simd_int_aa_sort_array_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);

}

/***************** Baseline benchmarks *********************************************************/

function baseline_int_array_add_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		init_random_int(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] + b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline simd_int_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline simd_int_array_add_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_float_array_add_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_float(a);
		init_random_float(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] + b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline simd_float_array_add_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline simd_float_array_add_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_int_array_sub_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		init_random_int(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] - b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_int_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_int_array_sub_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_float_array_sub_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] - b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_float_array_sub_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_float_array_sub_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_int_array_multiply_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);



	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		init_random_int(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] * b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline simd_int_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline simd_int_array_multiply_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}


function baseline_float_array_multiply_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = a[j] * b[j];
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_float_array_multiply_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_float_array_multiply_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_int_array_min_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		init_random_int(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.min(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_int_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_int_array_min_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_float_array_min_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.min(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// sconsole.info('Baseline baseline_float_array_min_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_float_array_min_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}



function baseline_int_array_max_benchmark(length, iteration) {
	let a = new Int32Array(length);
	let b = new Int32Array(length);
	let c = new Int32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		init_random_int(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.max(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_int_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_int_array_max_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}

function baseline_float_array_max_benchmark(length, iteration) {
	let a = new Float32Array(length);
	let b = new Float32Array(length);
	let c = new Float32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {

		init_random_float(a);
		init_random_float(b);

		let hrstart = process.hrtime();

		for (let j = 0; j < length; j++) {
			c[j] = Math.min(a[j], b[j]);
		}

		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_float_array_max_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_float_array_max_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}


function baseline_int_array_odd_even_sort_benchmark(length, iteration) {

	let a = new Int32Array(length);

	let amount_time = 0;

	for (let i = 0; i < iteration; i++) {

		init_random_int(a);
		let hrstart = process.hrtime();

		let isSorted = false; // Initially array is unsorted 

		for (let j = 0; j < length; j++) {
			let temp = 0;

			// Perform Bubble sort on odd indexed element 
			for (let k = 1; k <= length - 2; k = k + 2) {
				if (a[k] > a[k + 1]) {
					temp = a[k];
					a[k] = a[k + 1];
					a[k + 1] = temp;
				}
			}

			// Perform Bubble sort on even indexed element 
			for (let k = 0; k <= length - 2; k = k + 2) {
				if (a[k] > a[k + 1]) {
					temp = a[k];
					a[k] = a[k + 1];
					a[k + 1] = temp;
				}
			}
		}
		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_int_array_sort_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_int_array_sort_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);

}


function baseline_int_array_sort_benchmark(length, iteration) {

	let a = new Int32Array(length);

	let amount_time = 0;
	for (let i = 0; i < iteration; i++) {
		init_random_int(a);
		let hrstart = process.hrtime();

		a.sort();
		let hrend = process.hrtime(hrstart);
		amount_time += hrend[0] + hrend[1] / 1000000000;

		// console.info('Baseline baseline_int_array_sort_benchmark Execution time (hr): %ds', hrend[0], hrend[1] / 1000000000);
	}

	console.info('Baseline baseline_int_array_sort_benchmark Execution time (hr): %d ms', amount_time / iteration * 1000);
}


/***************** Compare benchmarks *********************************************************/

function int_add_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_int_array_add_benchmark(length, iteration);
	baseline_int_array_add_benchmark(length, iteration);
}

function float_add_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_float_array_add_benchmark(length, iteration);
	baseline_float_array_add_benchmark(length, iteration);
}

function int_sub_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_int_array_sub_benchmark(length, iteration);
	baseline_int_array_sub_benchmark(length, iteration);
}

function float_sub_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_float_array_sub_benchmark(length, iteration);
	baseline_float_array_sub_benchmark(length, iteration);
}

function int_multiply_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_int_array_multiply_benchmark(length, iteration);
	baseline_int_array_multiply_benchmark(length, iteration);
}

function float_multiply_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_float_array_multiply_benchmark(length, iteration);
	baseline_float_array_multiply_benchmark(length, iteration);
}

function int_min_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_int_array_min_benchmark(length, iteration);
	baseline_int_array_min_benchmark(length, iteration);
}

function float_min_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_float_array_min_benchmark(length, iteration);
	baseline_float_array_min_benchmark(length, iteration);
}

function int_max_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_int_array_max_benchmark(length, iteration);
	baseline_int_array_max_benchmark(length, iteration);
}

function float_max_array_benchmark() {
	let length = 100000;
	let iteration = 10;
	simd_float_array_max_benchmark(length, iteration);
	baseline_float_array_max_benchmark(length, iteration);
}

function int_odd_even_sort_array_benchmark() {
	let length = 10000;
	let iteration = 10;
	simd_int_odd_even_sort_array_benchmark(length, iteration);
	baseline_int_array_odd_even_sort_benchmark(length, iteration);
}

function int_aa_sort_array_benchmark() {
	let length = 10000;
	let iteration = 10;
	simd_int_aa_sort_array_benchmark(length, iteration);
	baseline_int_array_sort_benchmark(length, iteration);
}

em_module.onRuntimeInitialized = () => {

	int_add_array_benchmark();
	float_add_array_benchmark();
	int_sub_array_benchmark();
	float_sub_array_benchmark();
	int_multiply_array_benchmark();
	float_multiply_array_benchmark();
	int_min_array_benchmark();
	float_min_array_benchmark();
	int_max_array_benchmark();
	float_max_array_benchmark();
	int_odd_even_sort_array_benchmark();
	int_aa_sort_array_benchmark();

}
