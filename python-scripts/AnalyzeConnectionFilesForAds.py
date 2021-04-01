from os import stat
from os import listdir
import os
from os.path import isfile, join
import json

connectionFiles = [f for f in listdir('connection_results') if isfile(join('connection_results', f))]
while(1):
    if connectionFiles[connectionFiles.__len__() - 1][0] == '_':
        connectionFiles.pop()
    else:
        break

resultFile = open("connection_results/_resultsWithFilters.txt", "w")

with open('Lists/disconnect_list.json', 'r') as fp:
    listOfComparingDomains = json.load(fp)

listOfInterest = list(dict.fromkeys(listOfComparingDomains['Advertising']))

for connectionFile in connectionFiles:
    lines = []
    resultFile.write(connectionFile.split('_')[0] + ' ')
    with open('connection_results/' + connectionFile, 'r') as fp:
        lines = fp.read().splitlines()
    tmp = []
    for line in lines:
        if len(line.split('.')) > 2:
            lineFiltered = '.'.join(line.split('.')[1:])
        if line in listOfInterest:
            if not line in tmp:
                resultFile.write(line + ' ')
                tmp.append(line)
            continue
        if lineFiltered in listOfInterest:
            if not line in tmp:
                resultFile.write(line + ' ')
                tmp.append(line)
            continue
    resultFile.write('\n')


resultFile.close()
