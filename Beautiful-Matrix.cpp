#include<bits/stdc++.h>
using namespace std;
int pos(int nums[5][5]) {
    int mid = 2;
    for(int i=0; i<5; i++) {
        for(int j=0; j<5; j++) {
            if(nums[i][j] == 1) {
                return abs(mid - i) + abs(mid - j);
            }
        }
    }
    return 0;
}

int main() {
    int arr[5][5];
    for(int i=0; i<5; i++) {
        for(int j=0; j<5; j++) {
            cin>>arr[i][j];
        }
    }

    int ans = pos(arr);
    cout<<ans<<endl;

    return 0;
}