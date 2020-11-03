from os import stat
from os import listdir
import os, shutil
from os.path import isfile, join

connectionFiles = [f for f in listdir('ServiceWorkers') if isfile(join('ServiceWorkers', f))]
connectionFiles.pop()

folder = 'connection_results'
for filename in os.listdir(folder):
    file_path = os.path.join(folder, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (file_path, e))

for filename in connectionFiles:
    name = ''
    parts = filename.split('-')
    for i in range(len(parts)):
        if i < len(parts) - 1:
            if (i == 0):
                name += parts[i]
            else:  
                name += '-' + parts[i]
    with open('connection_results/' + name + '.txt', 'w'): pass