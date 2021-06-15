#!/usr/bin/env bash
if [ -f "proof.json" ]; then
    zokrates verify --proving-scheme gm17 --backend ark
    exit 0
else
    zokrates compile -i ../reveal_bit.zok -o reveal_bit --ztf
    zokrates setup -i reveal_bit --proving-scheme gm17 --backend ark
    cp proving.key ../alice/proving.key
    exit 0
fi