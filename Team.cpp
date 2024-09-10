#include<bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin>>t;
    int count = 0;
    while(t--){
        int petya, vasya, tonya;
        cin >> petya >> vasya >> tonya;  

        if (petya + vasya + tonya >= 2) {
            count++;
        }
    
    }
    std::cout<<count<<endl;

    return 0;
    
    
}