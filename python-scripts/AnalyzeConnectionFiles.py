from os import stat
from os import listdir
import os
from os.path import isfile, join
import json

connectionFiles = [f for f in listdir('connection_results') if isfile(join('connection_results', f))]
if connectionFiles[connectionFiles.__len__() - 1] == '_results.txt' :
    connectionFiles.pop()

resultFile = open("connection_results/_results.txt", "w")

with open('Lists/disconnect_list.json', 'r') as fp:
    listOfComparingDomains = json.load(fp)

for connectionFile in connectionFiles:
    lines = []
    resultFile.write(connectionFile[0:-4] + ' ')
    with open('connection_results/' + connectionFile, 'r') as fp:
        lines = fp.read().splitlines()
    for line in lines:
        #if line in listOfComparingDomains['Advertising']:
        resultFile.write(line + ' ')
    resultFile.write('\n')


resultFile.close()
