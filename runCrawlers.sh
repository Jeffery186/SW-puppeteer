#!/bin/bash

parts=($(echo $1 | tr '/' ' '))
fileName=${parts[1]}

echo $fileName

./Datasets/split-data.sh $1

mkdir results

for((i = 0; i < $(nproc); i++)); do
    screen -dmS crawler-$i bash -c "mocha --timeout=500000 ./crawler/crawler.js -splitedData/part-$i.csv -$i"
done