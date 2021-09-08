#!/bin/bash

FILE=$NETWORK'.json'

DATA=manifest/data/$FILE

echo 'Generating manifest from data file: '$DATA
cat $DATA

mustache \
  -p manifest/templates/AdManager.template.yaml \
  -p manifest/templates/DistributionRight.template.yaml \
  $DATA \
  subgraph.template.yaml > subgraph.yaml
