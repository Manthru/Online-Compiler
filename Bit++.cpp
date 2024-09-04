#include<bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin>>n;
    int m = 0;
    while(n--) {
        string x;
        cin>>x;

        if(x == "++X") {
            ++m;
        }else if(x == "--X") {
            --m;
        }else if(x == "X++") {
            m++;
        }else {
            m--;
        }
    }

    cout<<m<<endl;
    
    return 0;
}