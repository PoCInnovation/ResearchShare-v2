#!/usr/bin/env bash
rm -f alice/proving.key
rm -f bob/proof.json
cd bob && ./setup.sh && cd ..
cd alice && ./setup.sh && cd ..
cd bob && ./setup.sh && cd ..
