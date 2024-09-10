#include<bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin>>t;

    while(t--) {
        int a,b;
        cin>>a>>b;

        b = b % 2;
        if(a % 2 ) {
            cout<<"No"<<endl;
        }else if(b ==0 || a>=2) {
            cout<<"YES"<<endl;
        }else {
            cout<<"NO"<<endl;
        }
    }
    return 0;
}