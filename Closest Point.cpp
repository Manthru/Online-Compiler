#include<bits/stdc++.h>
using namespace std;
void solve() {
    int n;
    cin>>n;
    
    vector<int>num;

    for(int i=0; i<n; i++) {
        int x;
        cin>>x;
        num.push_back(x);
    }

    vector<int>dif;
    int j = 0;
    for(int i=1; i<n; i++) {
        int min = num[j] - num[i];
        dif.push_back(min);
        j++;
    }
    int k = 0;
    for(int i=0; i<dif.size(); i++) {
        if(dif[k] != dif[i]) {
            cout<<"NO"<<endl;
        }else {
            cout<<"YES"<<endl;
        }
    }
    
    

    
}

int main() {
    int t;
    cin>>t;

    while(t--) {
        solve();
    }
} 