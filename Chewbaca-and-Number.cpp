#include<bits/stdc++.h>
using namespace std;

int main() {

    string num;
    cin>>num;

    unordered_map<char,char> mpp;
    for(int i=0; i<5; i++) {
        char j = '0' + i;
        mpp[j] = '0' + (9-i);
    }
    
    for(int i=0; i<num.size(); i++) {
        if(num[i] == '9' && i == 0) {
            num[i] = num[i];
        }else {
            for(auto it : mpp) {
                if(num[i] == it.second) {
                    num[i] = it.first;
                }
            }
        }

    }
    
    cout<<num<<endl;

    return 0;
}