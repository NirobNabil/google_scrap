import urllib
import requests
import time
from bs4 import BeautifulSoup

# desktop user-agent
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
# mobile user-agent
MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"

headers = {"user-agent": USER_AGENT}

qstrings = ["Spice of asia", "Zeera 41 Calne Road Lyneham, Chippenham, SN15 4PR"]
n_errors = []
d_errors = []
res = []

for query in qstrings:
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
        
    res.append(data)
    time.sleep(2)
    
f = open("./data.txt", "a")
f.write(str(res))
f.close()
#attr_name = "data-local-attribute"
#data-attrs = ["kc:/collection/knowledge_panels/has_phone:phone", "kc:/location/location:address"]
#data_attrs_val = {'address': "d3adr", 'phone': "d3ph"}
#divs = soup.find_all('div', attrs={'data-local-attribute': True})
#for dtype in data_attrs:
    #[(lambda x: x if x[attr_name]==data_attrs_val[dtype] else None)(x) for x in divs)]

#data = []













