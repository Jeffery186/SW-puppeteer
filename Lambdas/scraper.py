import os, sys
import json
import time

siteList = "sitesWithSWFirst100K.txt"

def run(fileList):
	with open(fileList) as f:
		data = f.readlines()
		for site in data:
			print(site)
			os.system("node index.js "+site)
			time.sleep(10)
			
run(siteList)

