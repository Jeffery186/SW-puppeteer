#!/bin/bash

touch results/ServiceWorkers-Overall.txt

for((i = 0; i < $1; i++)); do
    cat results/ServiceWorkers-part$i.txt >> results/ServiceWorkers-Overall.txt
done

touch results/noServiceWorkersSites-Overall.txt

for((i = 0; i < $1; i++)); do
    cat results/noServiceWorkersSites-part$i.txt >> results/noServiceWorkersSites-Overall.txt
done

touch results/withServiceWorkersSites-Overall.txt

for((i = 0; i < $1; i++)); do
    cat results/withServiceWorkersSites-part$i.txt >> results/withServiceWorkersSites-Overall.txt
done

echo "Overall Statistics" > Statistics/Statistics-Overall.txt
echo "=============================" >> Statistics/Statistics-Overall.txt
echo "" >> Statistics/Statistics-Overall.txt
echo "$(($(cat results/ServiceWorkers-Overall.txt | wc -l)))/$(($(cat results/ServiceWorkers-Overall.txt | wc -l) + $(cat results/noServiceWorkersSites-Overall.txt | wc -l)))" >> Statistics/Statistics-Overall.txt
