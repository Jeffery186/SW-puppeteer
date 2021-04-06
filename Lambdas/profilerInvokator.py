#! /usr/bin/env python
# -*- coding: utf-8 -*-

import boto3
import sys
import os
import importlib
import json
import time

LAMBDA_FUNC = "similarweb-crawler"

region=["ap-southeast-2","sa-east-1","af-south-1","us-east-2","us-west-1","us-west-2","ap-northeast-1",
"ap-southeast-1","ap-northeast-2","ap-northeast-3","eu-north-1","eu-west-2","eu-west-3","eu-west-1",
"eu-central-1","ca-central-1","ap-south-1"]

if len(sys.argv)<2:
	print("No input args")
	sys.exit()
op = sys.argv[1]
if (int(op)==16):
	fileList = "tranco_first_150K"
elif (int(op)==17):
	op = 0
	fileList = "150K_first_tranco"
else:
	fileList = "site"+op+".txt"

print("Mode: ",op,"region",region[int(op)],"file",fileList)

client = boto3.client('lambda', region_name=region[int(op)]) 
with open(fileList) as f:
	data = f.readlines()
	for site in data:
		print("----------------------------------------")
		payld={'site': site}
		print("Invoking "+LAMBDA_FUNC+" -> "+site)
		response=client.invoke(FunctionName=LAMBDA_FUNC, InvocationType='Event', Payload=json.dumps(payld))
		time.sleep(11)
		print(response)
		print("##############")
print('Done with lamda invoking')
