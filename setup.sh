#!/usr/bin/env bash

git clone https://github.com/bridges-inc/kaleido-core.git
cd kaleido-core
git fetch
git pull origin release/v1.0
yarn && npx hardhat compile
cd ..
yarn manifest:dev
