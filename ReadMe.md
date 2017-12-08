## A screenshot & markdown generator

[![npm version](https://badge.fury.io/js/auto-docs.svg)](https://www.npmjs.com/package/auto-docs)


### install

* npm install -g testcafe
* npm install -g docsify-cli
* npm install --save-dev auto-docs

### in you package.json - scripts

To generate
```
testcafe \"chrome --kiosk --incognito --force-device-scale-factor=1.5\" node_modules/auto-docs/ -s docs/pics
```

To run document server
```
docsify serve docs
```
