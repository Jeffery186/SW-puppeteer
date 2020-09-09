#!/bin/bash

dif=$(($(cat $1 | wc -l)/$(nproc) + 1))

rm -rf splitedData
mkdir splitedData

for((i = 0; i < $(nproc); i++)); do
    awk 'NR == '$(($i * $dif + 1))', NR == '$((($i + 1) * $dif))' {print}' $1 > splitedData/part-$i.csv
done