#include <immintrin.h>
#include <iostream>

using namespace std;

void simdDoubleAdd (double* a, double* b, double* result, unsigned int length) {
  	int i;
	__m256d sum = {0.0, 0.0, 0.0, 0.0}; //vector to hold partial sums

	for (i = 0; i < length; i += 4) {
        __m256d va = _mm256_load_pd(&a[i]);
        __m256d vb = _mm256_load_pd(&b[i]);
        sum = _mm256_add_pd (va, vb);
        _mm256_store_pd(&result[i], sum);
	}
}

int main(int argc, char** argv) {
	int length = 800000;
	double* a = new double[length];
	double* b = new double[length];
	double* result = new double[length];

	int i;
	for (i = 0; i < length; i++) {
		a[i] = i;
		b[i] = i + 1;
	} 

	simdDoubleAdd(a, b, result, length);

	for (i = 0; i < length; i++) {
		if ((int)a[i] + (int)b[i] != (int)result[i]) {
			cout << "Simd compute error " << result[i] << endl;
		}
	} 
	return 0;
}