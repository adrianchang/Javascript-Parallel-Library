const simd_operations = require('./operation.js');
const em_module = require('./a.out.js');

function initI(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = i;
	}
}

function initIPlusOne(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = i + 1;
	}
}

function initZero(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = 0;
	}
}

const length = 80000;

let a = new Int32Array(length);
let b = new Int32Array(length);

initI(a);
initIPlusOne(b);

em_module.onRuntimeInitialized = () => {
	console.log("simd_operations start");
	let c = simd_operations.sim_int_aray_add(a, b);
	console.log("simd_operations end");
	for (let i = 0; i < length; i++) {
		if (a[i] + b[i] != c[i]) {
			console.log("simdIntAdd calculation error");
		}
	}
}
