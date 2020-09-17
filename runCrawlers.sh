#!/bin/bash

parts=($(echo $1 | tr '/' ' '))
fileName=${parts[1]}

echo $fileName

./Datasets/split-data.sh $1 $2
python3 python-scripts/updatePackageJson.py $2

rm -rf results/*Service*
rm -rf Statistics/*part*

for((i = 0; i < $2; i++)); do
    screen -dmS crawler-$i bash -c "npm run crawler:$i"
done