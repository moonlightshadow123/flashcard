import json, os
from os import listdir
from os.path import isfile, join

BASE_URL = "/csv/"
BASE_PATH = "../web/csv"
SAVE_PATH = "../web/data.json"
def genJson():
	res = []
	for f in listdir(BASE_PATH):
		fullpath = join(BASE_PATH, f)
		info = getFileInfo(f, fullpath)
		res.append(info)
	with open(SAVE_PATH, "w") as f:
		json.dump(res, f, indent=4)
	print(res)

def getFileInfo(filename, fullpath):
	res = {}
	lang = filename.split(".")[1]
	length = sum(1 for line in open(fullpath, encoding="utf-8"))-1
	res["name"] = filename
	res["lang"] = lang
	res["url"] = BASE_URL + filename
	res["length"] = length
	return res

if __name__ == "__main__":
	genJson()