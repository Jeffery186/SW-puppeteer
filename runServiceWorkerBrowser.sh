#!/bin/bash

parts=($(echo $1 | tr '/' ' '))
fileName=${parts[1]}

./Datasets/split-data.sh $1 $2

for((i = 0; i < $2; i++)); do
    screen -dmS SWBrowser-$i bash -c "node crawler/openServiceWorkerBrowser.js -splitedData/part-$i.csv"
done
