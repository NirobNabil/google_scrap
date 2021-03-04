#include<bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;
using ll = long long;
using pii = pair<int, int>;
#define endl '\n'

int main(){
    ios_base::sync_with_stdio(false);
    
    ifstream file("data.json");
    json data = json::parse(file);

    map<string, set<tuple<string, string, string, string>>> mp;

    for(json i : data) {
        if(i["phone"].size() == 0) i["phone"] = "Not found";
        if(i["website"].size() == 0) i["website"] = "Not found";
        string name = i["name"];
        string address = i["address"];
        string phone = i["phone"];
        string site = i["website"];

        // parse post code from address start
        int j = address.size() - 1;
        while(address[j] != ',') j--;
        j+=2;

        string s;
        while(j < address.size() and address[j] != ' ') 
            s += address[j], j++;
        //done


        //remove useless extension from site start
        bool f = 0;
        for(char c : site) f |= (c == '?');
        if(f) {
            while(site.back() != '?') site.pop_back();
            site.pop_back();
        }
        // done

        mp[s].insert({name, address, phone, site});
    }

    // file variables
    ofstream Name, Address, Phone, Site;

    Name.open("name.txt");
    Address.open("address.txt");
    Phone.open("phone.txt");
    Site.open("site.txt");

    for(auto [s, st] : mp) {
        Name << s << endl;
        Address << endl;
        Phone << endl;
        Site << endl;

        for(auto [name, address, phone, site] : st){
            Name << name << endl;
            Address << address << endl;
            Phone << phone << endl;
            Site << site << endl;
            cout << endl;
        }
        Name << endl << endl;
        Address << endl << endl;
        Phone << endl << endl;
        Site << endl << endl;
    }

    return 0;
}
