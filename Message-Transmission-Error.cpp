#include <iostream>
#include <string>
using namespace std;

int main() {
    string t;
    cin >> t;
    int n = t.length();

    // Loop to check for a possible merging point
    for (int i = 1; i < n; i++) {
        // Check if the substring starting from index i matches the prefix of the string
        if (t.substr(0, n - i) == t.substr(i, n - i)) {
            cout << "YES" << endl;
            cout << t.substr(0, i) << endl;  // s is the part before the merging
            return 0;
        }
    }

    // If no merging point is found, output "NO"
    cout << "NO" << endl;
    return 0;
}
