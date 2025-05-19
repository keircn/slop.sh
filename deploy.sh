#!/bin/bash

cd /home/keiran/prod/slop-new
git fetch origin main
git reset --hard origin/main
pnpm i
pnpm build
pm2 restart 3
