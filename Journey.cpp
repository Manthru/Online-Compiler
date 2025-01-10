#include<bits/stdc++.h>
using namespace std;

void solve() {
    
    int n, a, b, c;
    cin>>n>>a>>b>>c;

    int sum = a + b + c;
        int val = (n / sum) * 3;
 
        if(n % sum == 0) {
            
            cout << val << endl;
            
        }else if (n % sum <= a) {
            
            cout << val + 1 << endl;
            
        }else if (n % sum <= a + b) {
            
            cout << val + 2 << endl;
            
        }else {
            
            cout << val + 3 << endl;
        }
}

int main() {
    int t;
    cin>>t;

    while(t--) {
        solve();
    }
}
