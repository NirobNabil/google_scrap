import urllib
import requests
import time
from bs4 import BeautifulSoup
import json

# desktop user-agent
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:86.0) Gecko/20100101 Firefox/86.0"
COOKIE = f"CGIC=CgtmaXJlZm94LWItZCJVdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksaW1hZ2UvYXZpZixpbWFnZS93ZWJwLCovKjtxPTAuOA; 1P_JAR=2021-03-02-14; NID=210=SXHXSfEILToHGDtlaIeJ6iAajE9gC5QdcC90D-p5kFFhAEX9MWChI5W8NpiDtoB1t1PyG2dGnI54UcymI_lZur3Db4pePGYIJe-Nai0jcndPEDLYs7gFDsvHEFu2eUWibwOxObRm78pnJVU3ay0gY7mtPsDR2Nm0ZcQEFL-L-8F0lkI6i0z5UZboZ8IS-YkP9At3R5cYC-9VYCk5XiJ7qkhY6dO_4nu_sDHSIjefw5qRn7PY9K0S3YDEpLCnU6yr1TPWuhlIs0e7_8aHc8xQ1YSoCtTdv-jq-VZVoSWNGcA0hqhaqlb9_ZEga_tFdbETdLNuldhFaDfZJeaAu5xTa…18-0; SIDCC=AJi4QfEE-C8LwUzGUfWeSzBIXYhsnH4lbCPeESYLCFTUD9ELMSw-0S5rbDkoY1DMbdynpzhLSoL2; SEARCH_SAMESITE=CgQI2JEB; __Secure-3PSIDCC=AJi4QfE4OCbLlRXTE8Y66NbDMdS7P4XZBTOM792uO3ZeN4b81fsFp9VJqdFMq4tPhoJNEVJQ-sZ-; OTZ=5838359_32_32__32_; S=billing-ui-v3=u-8tpnnA3GVZP83X24HLKtfFkea5urQl:billing-ui-v3-efe=u-8tpnnA3GVZP83X24HLKtfFkea5urQl; DV=MwdF8TpBLpKlIBqkWuyFV2lKW5c0fxek1AaxNaN2ogAAAEDoe9uMnBRHTAAAAPCSFA-qpoSSMgAAAHjU1yhfGuRCDgAAAIj4tWEufHk29toE4NEdj8dT9XjavTYB8DXZOnSycsWPr00AwoH7MyVDtA7maxMAG-871Dv-zIj72gQA"
# mobile user-agent
MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"

headers = {"user-agent": USER_AGENT}

qnames = ["Spice of asia", "Zeera 41"]
qaddr = ["111 Chippenham Rd, Lyneham, Chippenham SN15 4PB, United Kingdom", "Calne Road Lyneham, Chippenham, SN15 4PR"]
n_errors = []
d_errors = []
res = {}
d_attr_names = ["phone", "website"]

for i in range(len(qnames)):
    query = qnames[i] + qaddr[i]
    query = query.replace(' ', '+')
    URL = f"https://google.com/search?client=firefox-b-d&q={query}"
    resp = requests.get(URL, headers=headers)
    data = {}
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        for item in soup.find_all('span', class_="LrzXr"):
            c = ""
            for child in item.descendants:
                c = child
            data(c)
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













