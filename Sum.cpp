#include<bits/stdc++.h>
using namespace std;

int main() {

    int t;
    cin>>t;

    while(t--) {
        int a,b,c;

        int sum = 0;
        for(int i=0; i<3; i++) {
            cin>>a;
            sum += a;
        }

        if(sum-a == a || sum-b == b || sum-c == c) {
            cout<<"YES"<<endl;
        }else {
            cout<<"NO"<<endl;
        }
    }
}