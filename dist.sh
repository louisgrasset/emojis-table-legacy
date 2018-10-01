#!/usr/bin/env sh
rm -R build 2>/dev/null
mkdir "build"
cd ./src/
npm install
cd ../
cp ./src/node_modules/emoji.json/emoji.json ./build/emoji.json
cp ./src/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js ./build/smoothscroll.js
cp -R ./src/*.* ./src/icons/ ./build/
rm ./build/icons/*.psd
cd ./build/
zip -r ../build/build.zip ./
cd ../
rm -R dist 2>/dev/null
mkdir "dist"
cp ./build/build.zip ./dist/emojis-table-chrome-X.XX.zip
mv ./build/build.zip ./dist/emojis-table-firefox-X.XX.xpi
