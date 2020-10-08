#!/bin/bash

parts=($(echo $1 | tr '/' ' '))
fileName=${parts[1]}

./Datasets/split-data.sh $1 $2
python3 python-scripts/updatePackageJson.py $2

rm -rf results/*Service*
rm -rf Statistics/*part*
rm -rf Statistics/*Overall*

for((i = 0; i < $2; i++)); do
    screen -dmS crawler-$i bash -c "xvfb-run -a --server-args=\"-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR\" npm run crawler:$i"
done
