from os import stat
from os import listdir
import os
from os.path import isfile, join
import json

numberOfSitesCrawled = '100K'

connectionFiles = [f for f in listdir('connection_results') if isfile(join('connection_results', f))]
while(1):
    if connectionFiles[connectionFiles.__len__() - 1][0] == '_':
        connectionFiles.pop()
    else:
        break

resultFile = open("connection_results/_sitesWithSWFirst" + numberOfSitesCrawled + ".txt", "w")

for connectionFile in connectionFiles:
    resultFile.write(connectionFile.split('_')[0] + ',\n')

resultFile.close()
