#include<bits/stdc++.h>
using namespace std;
// Function to convert a character into lowercase
int lowercase(char ch){
    if( (ch >='a' && ch <='z') )
        return ch;
    else{
        char temp = ch - 'A' + 'a';
        return temp;
    }
}

int main() {
    string s1,s2;
    cin>>s1>>s2;

    
    string temp1="";
    string temp2="";

    for(int i=0; i<s1.size(); i++){
        temp1.push_back(lowercase(s1[i]));
    }
    cout<<temp1<<endl;


    for(int i=0; i<s2.size(); i++){
         temp2.push_back(lowercase(s2[i]));
         
    }

    
    if(temp1 < temp2) {
        cout<<"-1"<<endl;
    }else if(temp1 > temp2) {
        cout<<"1"<<endl;
    }else {
        cout<<"0"<<endl;
    }

    return 0;
}