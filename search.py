import urllib
import requests
import time
from bs4 import BeautifulSoup
import json

# desktop user-agent
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
# mobile user-agent
MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"

headers = {"user-agent": USER_AGENT}

qnames = ["Spice of asia", "Zeera 41"]
qaddr = ["111 Chippenham Rd, Lyneham, Chippenham SN15 4PB, United Kingdom", "Calne Road Lyneham, Chippenham, SN15 4PR"]
n_errors = []
d_errors = []
res = {}

for i in range(len(qnames)):
    query = qnames[i] + qaddr[i]
    query = query.replace(' ', '+')
    URL = f"https://google.com/search?client=firefox-b-d&q={query}"
    resp = requests.get(URL, headers=headers)
    data = []
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        for item in soup.find_all('span', class_="LrzXr"):
            c = ""
            for child in item.descendants:
                c = child
            data.append(c)
        if len(data) < 2:
            d_errors.append(query)
    else:
        n_errors.append(query)
        
    res[qnames[i]] = data
    time.sleep(2)

res_s = json.dumps(res, ensure_ascii=False, indent=2)
f_ne = open("./n_error.txt", "w");
f_de = open("./d_error.txt", "w");
f_d = open("./data.txt", "w")
f_ne.write(str(n_errors))
f_de.write(str(d_errors))
f_d.write(str(res_s))
f_ne.close()
f_de.close()
f_d.close()





#attr_name = "data-local-attribute"
#data-attrs = ["kc:/collection/knowledge_panels/has_phone:phone", "kc:/location/location:address"]
#data_attrs_val = {'address': "d3adr", 'phone': "d3ph"}
#divs = soup.find_all('div', attrs={'data-local-attribute': True})
#for dtype in data_attrs:
    #[(lambda x: x if x[attr_name]==data_attrs_val[dtype] else None)(x) for x in divs)]

#data = []













