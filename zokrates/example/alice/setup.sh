#!/usr/bin/env bash
if [ -f "proving.key" ]; then
    zokrates compile -i ../reveal_bit.zok -o reveal_bit --ztf
    zokrates compute-witness -i reveal_bit -a 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 510
    zokrates generate-proof -i reveal_bit --proving-scheme gm17 --backend ark
    cp proof.json ../bob/proof.json
    exit 0
else
    echo "You must run bob's setup script first in order to run this script."
    exit 1
fi