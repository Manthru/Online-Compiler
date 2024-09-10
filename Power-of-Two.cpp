// C++ implementation of the above approach
#include <iostream>
using namespace std;

// Function to print k numbers which are powers of two
// and whose sum is equal to n
void FindAllElements(int n, int k)
{
	// Initialising the sum with k
	int sum = k;

	// Initialising an array A with k elements
	// and filling all elements with 1
	int A[k];
	fill(A, A + k, 1);

	for (int i = k - 1; i >= 0; --i) {

		// Iterating A[] from k-1 to 0
		while (sum + A[i] <= n) {

			// Update sum and A[i]
			// till sum + A[i] is less than equal to n
			sum += A[i];
			A[i] *= 2;
		}
	}

	// Impossible to find the combination
	if (sum != n) {
		cout <<"NO"<<endl;
	}

	// Possible solution is stored in A[]
	else {
        cout<<"YES"<<endl;
		for (int i = 0; i < k; ++i)
			cout << A[i] << ' ';
	}
}

// Driver code
int main()
{
	int n = 12;
	int k = 6;

	FindAllElements(n, k);

	return 0;
}
