#!/bin/bash

for((i = $1; i < $(($2 + 1)); i++)); do
    ./runCrawlers.sh topSitesSplited/part-$i.csv 22
    echo "Running crawlers for part-$i..."
    sleep 5000
    echo "Calculating results of part-$i..."
    ./killCrawlers.sh 22
    ./createOverAll.sh 22
    echo "Moving files to crawled/part-$i..."
    mkdir crawled/part-$i
    mv Statistics/Statistics-Overall.txt crawled/part-$i/
    mv results/noServiceWorkersSites-Overall.txt crawled/part-$i/
    mv results/ServiceWorkers-Overall.txt crawled/part-$i/
    mv results/withServiceWorkersSites-Overall.txt crawled/part-$i/
    echo "part-$i successfully crawled"
done
