
import requests
import csv
import json

URL = "https://www.ncei.noaa.gov/pub/data/paleo/contributions_by_author/moberg2005/nhtemp-moberg2005.txt"
data = {}
with requests.Session() as s:
    download = s.get(URL)

    decoded_content = download.content.decode('iso-8859-1')

    cr = csv.reader(decoded_content.splitlines())
    my_list = list(cr)
    keys = my_list[92][0].split()
    data_list = []
    JSONstr = {}
    for row in my_list[93::]:
        row = row[0].split()
        JSONstr["Time"] = "0"*(4-len(row[0]))+row[0]
        for i in range(1, len(row)):
            # key = keys[i]
            # match key:
            #     case ""
            JSONstr[keys[i]] = row[i]
        data_list.append(JSONstr)
        JSONstr = {}
    print(data_list)
    data["data"] = data_list


# with open("v1.csv",encoding='utf-8') as csvf:
    # csvReader=csv.DictReader(csvf)
    # print(csvf)
    # for rows in csvReader:
    # key=rows['Time']
    # data[key]=rows

file = open("files_output/V2/V2.json", 'a+')
with open("files_output/V2/V2.json", 'w', encoding='utf-8') as jsonf:
    jsonf.write(json.dumps(data, indent=4))
