#! /usr/bin/env python
# -*- coding: utf-8 -*-

import boto3
import sys
import os
import time
import importlib
import json

LAMBDA_FUNC = "similarweb-crawler"
fileList = "_sitesWithSWFirst100K.txt"

client = boto3.client('lambda')
with open(fileList) as f:
	data = json.load(f)
	for site in data:
		print("----------------------------------------")
		payld={'site': site}
		print("Invoking "+LAMBDA_FUNC+" -> "+site)
		response=client.invoke(FunctionName=LAMBDA_FUNC, InvocationType='Event', Payload=json.dumps(payld))
		print(response)
		time.sleep(2)
		print("##############")
print('Done with lamda invoking')
