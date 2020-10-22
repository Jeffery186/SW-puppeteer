import json
import sys
from os import stat
from os import listdir
from os.path import isfile, join

HARfiles = [f for f in listdir('HARfiles') if isfile(join('HARfiles', f))]

for HARfile in HARfiles:
    if stat('HARfiles/' + HARfile).st_size == 0:
        print('\nHAR file: ' + HARfile + ' is empty. Moving on!')
        continue
    print('\nHAR file: ' + HARfile)
    with open('HARfiles/' + HARfile, 'r', encoding="utf8") as fp:
        HARfileContent = json.load(fp)

    for item in HARfileContent['log']['entries']:
        dest_url = item['request']['url']
        if(dest_url.find('ServiceWorkers') != -1):
            print('SW file: ' + dest_url.split('/')[4])
            continue
        if(dest_url.find('127.0.0.1') != -1):
            continue
        print("type: " + item['_initiator']['type'])
        print("url: " + item['request']['url'])