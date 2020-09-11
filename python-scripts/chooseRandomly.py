import sys
from random import seed
from random import randint

output = []

seed(int(sys.argv[2]))

with open(sys.argv[1], 'r') as fp:
    input = fp.read().splitlines()

for i in range(100):
    randomNum = randint(0, len(input))
    output.append(input[randomNum])
    del input[randomNum]

with open('randomSites.txt', 'w') as fp:
    for item in output:
        fp.write('%s\n' % item)