#include<bits/stdc++.h>
using namespace std;

int main() {

    int n,k,l,c,d,p,nl,np;
    cin>>n>>k>>l>>c>>d>>p>>nl>>np;

    int t1 = c * d;
    int td = k * l;
    int x = td / (n * nl);
    int y = t1/n;
    int z = p / (n*np);
    int res = min(x,min(y,z));
    
    cout<<res<<endl;

    return 0;
}