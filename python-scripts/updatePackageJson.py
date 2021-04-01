import json
import sys

numberToStrings = [
    'first', 'second', 'third', 'forth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
    'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'
    ]

testNumber = 9
labels = 'mocha --timeout=500000'

with open('package.json', 'r') as fp:
    package = json.load(fp)

temp = []

for key in package['scripts']:
    temp.append(key)

for key in temp:
    package['scripts'].pop(key, None)

package['scripts']['crawler:test1'] = labels + ' ./crawler/crawler.js -Datasets/serviceWorkersSite.csv -1'
package['scripts']['crawler:test2'] = labels + ' ./crawler/crawler.js -Datasets/serviceWorkersSite2.csv -2'
package['scripts']['crawler'] = labels + ' ./crawler/crawler.js -Datasets/top-1m-tranco.csv -1'
package['scripts']['crawler:debug'] = labels + ' ./crawler/crawler.js -Datasets/falseNegativeSites.csv -1'

for i in range(testNumber):
    package['scripts']['test:' + numberToStrings[i]] = f'{labels} ./tests/{numberToStrings[i]}.test.js'

for i in range(int(sys.argv[1])):
    package['scripts']['crawler:' + str(i)] = f'{labels} ./crawler/crawler.js -splitedData/part-{i}.csv -{i}'

for i in range(int(sys.argv[1])):
    package['scripts']['infoGatherer:' + str(i)] = f'{labels} ./crawler/statisticsGatherer.js -splitedData/part-{i}.csv -{i}'


with open('package.json', 'w') as fp:
    json.dump(package, fp, indent = True)