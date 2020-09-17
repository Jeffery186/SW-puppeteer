#!/bin/bash

echo "" > results/ServiceWorkersOverall.txt

for((i = 0; i < $1; i++)); do
    cat ServiceWorkers-part$i >> results/ServiceWorkersOverall.txt
done

echo "Overall Statistics\n" > Statistics/StatisticsOverall.txt
echo "=============================\n" >> Statistics/StatisticsOverall.txt
echo "\n" >> Statistics/StatisticsOverall.txt

OverallSW=0
OverallSites=0

for((i = 0; i < $1; i++)); do
    
done