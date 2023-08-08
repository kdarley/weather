import pandas as pd 
import json
# from json import 

filename = "weather_conditions.csv"


df = pd.read_csv(filename)

js = df.to_json(orient="index")
js2 = json.loads(js)

stringObject = ""
# print(string)
for x in js2:
    string1 = "'" + str(js2[x]['code'])
    string2= str(js2[x]['icon']) + "'"

    stringObject += string1 + ":" + string2 + ","


print(stringObject)

# dictionary = dict(zip(str(df['code']), str(df['icon'])))
# print(dictionary)
# print(df.to_dict()['icon'])