#include<bits/stdc++.h>
using namespace std;

int main() {
    int n,k;
    cin>>n>>k;

    int count = 0;
    for(int i=1; i<=n; i++) {
        int x;
        cin>>x;
        if(x >= k) {
            count++;
        }

    }

    cout<<count<<endl;
}