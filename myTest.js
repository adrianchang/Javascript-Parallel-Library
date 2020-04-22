const em_module = require('./a.out.js');
em_module.onRuntimeInitialized = function() {
  	const sqrt = em_module.cwrap('int_sqrt', 'number', ['number']);
	console.log(sqrt(9));
}