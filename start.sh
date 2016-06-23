#!/usr/bin/env bash
CACHE_DIR="`pwd`/cache"

mkdir -p $CACHE_DIR

if [[ ! -d "$CACHE_DIR/pandoc" ]]; then
    cd $CACHE_DIR
    mkdir pandoc && cd pandoc
    curl https://dropshare-ro.s3-eu-central-1.amazonaws.com/pandoc.tar.gz -s | tar xz &> /dev/null
    cd ../..
fi
export PATH=$CACHE_DIR/pandoc:$PATH

npm start
