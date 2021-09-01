#!/usr/bin/env bash

git clone https://github.com/bridges-inc/kaleido-core.git
cd kaleido-core
git fetch
git pull origin develop
yarn && npx hardhat compile
cd ..
yarn manifest:dev
