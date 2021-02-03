import os, sys
import json
import time

siteList = "_sitesWithSWFirst100K.txt"

def run(fileList):
	with open(fileList) as f:
		data = json.load(f)
		for site in data:
			os.system("node index.js "+site)
			#time.sleep(5)
			
run(siteList)

