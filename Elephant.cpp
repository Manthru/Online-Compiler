#include<bits/stdc++.h>
using namespace std;

int check(int num) {
    if(num <= 5) {
        return 1;
    }else {
        return (num + 4) / 5; 
    
    }
    
     
}


int main() {
    int num;
    cin>>num;

    int ans = check(num);
    cout<<ans<<endl;
}