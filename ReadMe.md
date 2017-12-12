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

# Api

### brower commands

* navigateTo: go to a given url - (url)
* typeText: enter text into an input - (selecter,text)
* click: click on an element - (selecter)

### document commands

* description: Add basic text to document - (text)
* screenshot: Capture the screen and add to document - (screenshot_name)
* link: Add a link to document (title,url)
* img: Add a image to document (title,url)
* code: Add a block of code to document (source,[type]) ***type** of optional*
* pageBreak: Add a link break to document () ~ No arguments
* title: Add a heading to document (text) or (level,text) *to set the depth of the sub heading*
* youtube: A thumbnail link to a video (video_id,[start from X sec]) ***start** of optional*
    * You will need a "playbutton.png" in your "pics" folder

#### youtube button placement
```
<style>
p{
  position: relative;
}
img[alt='videobutton']{
    pointer-events: none;
    position: absolute;
    z-index: 3;
    top: calc( 50% - 50px);
    left: calc( 50% - 50px);
    width: 100px;
}
</style>
```

## config file

From with the manual folder you should place a **config.json** file

Example:

```json
{
  "server":"http://localhost:3000/myapp/",
  "only":["1-Welcome","1-How to log in"],
  "waitBeforeScreenShot":1000,
  "login":{
    "user":["#username", "admin"],
    "pass":["#password", "admin"],
    "url":"login.html",
    "button":"#loginButton"
  }
}
```
* server: the path to your server
* only: An array of file steps to the page you want to regenerate  *optional!*
* waitBeforeScreenShot: how long to wite for taking a ScreenShot *optional!* (Default: 0)
* login: login credentials to use
