#include<bits/stdc++.h>
using namespace std;

int main() {
    int weight;
    cin>>weight;
    if(weight < 3) {
        cout<<"NO"<<endl;
    }else if(weight%2 == 0) {
        cout<<"YES"<<endl;
    }else {
        cout<<"NO"<<endl;
    }
    return 0;

}