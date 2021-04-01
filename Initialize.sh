#!/bin/bash

npm install

chmod +x runCrawlers.sh
chmod +x runCrawlersHeadlessMode.sh
chmod +x createOverAll.sh
chmod +x killCrawlers.sh
chmod +x runParts.sh
chmod +x runPartsHeadlessMode.sh
chmod +x runServiceWorkerBrowser.sh
chmod +x Datasets/split-data.sh

./Datasets/split-data.sh ./Datasets/tranco_1m_unique.csv 1000
mv splitedData/ topSitesSplited