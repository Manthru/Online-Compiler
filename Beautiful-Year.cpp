#include<bits/stdc++.h>
using namespace std;


bool check(int year) {

    // convert integer to string
    string y = to_string(year);

    set<int>st; // creat a set data structure

    for(auto it : y) { // insert all the elements in the set
        st.insert(it);
    }

    if(y.size() != st.size()) { // compare the both size
        return true;
    }else {
        return false;
    }
}

int main() {
    int year;
    cin>>year;

    while (true) {
        year++;
        if (check(year)) {
            cout << year << endl;
            break;
        }
    }
}