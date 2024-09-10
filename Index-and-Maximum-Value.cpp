#include<bits/stdc++.h>
using namespace std;

// Functions to find the maximum in the array
int maximum(vector<int>& num) {
    int max = INT_MIN;
    for(int i=0; i<num.size(); i++) {
        if(num[i] >= max) {
            max = num[i];
        }
    }

    return max;
}


void solve() {
    int length,operations;
    cin>>length>>operations;

    vector<int>num;
    for(int i=0; i<length; i++) {
        int x;
        cin>>x;
        num.push_back(x);
    }

    vector<int>ans;
    int maxi = maximum(num);

    while(operations--) {
        char c;
        int l,r;
        cin>>c>>l>>r;

        if(c == '+') {
            if(maxi <=r && maxi>=l) {
                maxi++;
            }
        }else {
            if(maxi <=r && maxi>=l) {
                maxi--;
            }
        }

        ans.push_back(maxi);
    }

    for(auto it : ans) {
        cout<<it<<" ";
    }

    cout<<endl;
}

// -----------------------------------------------------------------------------------------

int main() {
    int t;
    cin>>t;

    while(t--) {
        solve();
    }

    return 0;
}