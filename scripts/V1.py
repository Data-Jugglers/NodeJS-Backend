import requests
import csv
import json


def csv_to_json(URL, fileName):

    data = {}
    with requests.Session() as s:
        download = s.get(URL)

        decoded_content = download.content.decode('utf-8')

        cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        my_list = list(cr)
        key = my_list[0][1]
        data_list = []
        for row in my_list[1::]:

            data_list.append({"Time": row[0], "degC": row[1],
                              })
        # print(data_list)
    # with open("v1.csv",encoding='utf-8') as csvf:
        # csvReader=csv.DictReader(csvf)
        # print(csvf)
        # for rows in csvReader:
        # key=rows['Time']
        # data[key]=rows
        data["data"] = data_list
    file = open("files_output/V1/"+fileName, 'a+')
    with open("files_output/V1/"+fileName, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


csv_to_json("https://www.metoffice.gov.uk/hadobs/hadcrut5/data/current/analysis/diagnostics/HadCRUT.5.0.1.0.analysis.summary_series.global.annual.csv", "V1Gy.json")

csv_to_json("https://www.metoffice.gov.uk/hadobs/hadcrut5/data/current/analysis/diagnostics/HadCRUT.5.0.1.0.analysis.summary_series.global.monthly.csv", "V1Gm.json")

csv_to_json("https://www.metoffice.gov.uk/hadobs/hadcrut5/data/current/analysis/diagnostics/HadCRUT.5.0.1.0.analysis.summary_series.northern_hemisphere.monthly.csv", "V1Nm.json")
csv_to_json("https://www.metoffice.gov.uk/hadobs/hadcrut5/data/current/analysis/diagnostics/HadCRUT.5.0.1.0.analysis.summary_series.northern_hemisphere.annual.csv", "V1Ny.json")

csv_to_json("https://www.metoffice.gov.uk/hadobs/hadcrut5/data/current/analysis/diagnostics/HadCRUT.5.0.1.0.analysis.summary_series.southern_hemisphere.monthly.csv", "V1Sm.json")
csv_to_json("https://www.metoffice.gov.uk/hadobs/hadcrut5/data/current/analysis/diagnostics/HadCRUT.5.0.1.0.analysis.summary_series.southern_hemisphere.annual.csv", "V1Sy.json")
