#!/bin/bash

dif=$(($(cat $1 | wc -l)/$2 + 1))

rm -rf splitedData
mkdir splitedData

for((i = 0; i < $2; i++)); do
    awk 'NR == '$(($i * $dif + 1))', NR == '$((($i + 1) * $dif))' {print}' $1 > splitedData/part-$i.csv
done