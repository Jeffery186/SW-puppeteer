#!/bin/bash

for((i = 0; i < $1; i++)); do
    screen -S crawler-$i -X quit >/dev/null
done


