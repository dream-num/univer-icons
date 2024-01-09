#! /bin/bash
cd ..
yarn
yarn go
cd packages/react
yarn
yarn build
cd ../../doc/
yarn
