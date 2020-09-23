#!/bin/bash

echo "" > results/ServiceWorkers-Overall.txt

for((i = 0; i < $1; i++)); do
    cat ServiceWorkers-part$i >> results/ServiceWorkers-Overall.txt
done

echo "" > results/noServiceWorkersSites-Overall.txt

for((i = 0; i < $1; i++)); do
    cat noServiceWorkersSites-part$i >> results/noServiceWorkersSites-Overall.txt
done

echo "Overall Statistics\n" > Statistics/StatisticsOverall.txt
echo "=============================\n" >> Statistics/StatisticsOverall.txt
echo "\n" >> Statistics/StatisticsOverall.txt
echo "$(cat results/ServiceWorkers-Overal | wc -l)/$(($(cat results/ServiceWorkers-Overall.txt | wc -l) + $(cat results/noServiceWorkersSites-Overall.txt | wc -l)))"