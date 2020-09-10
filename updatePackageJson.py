import json

with open('package.json', 'r') as fp:
    package = json.load(fp)

for i in range(8):
    package['script'].pop('crawler:' + i, None)

for i in range(16):
    package['script']['crawler:' + i] = f'mocha --timeout=500000 ./crawler/crawler.js -splitedData/part-{i}.csv -{i}'

with open('package.json', 'w') as fp:
    json.dump(package, fp, indent = True)