#!/bin/bash

parts=($(echo $1 | tr '/' ' '))
fileName=${parts[1]}

echo $fileName

./Datasets/split-data.sh $1

for((i = 0; i < $(nproc); i++)); do
    screen -dmS crawler-$i bash -c "npm run crawler:$i"
done