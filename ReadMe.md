## A screenshot & markdown generator

[![npm version](https://badge.fury.io/js/auto-docs.svg)](https://www.npmjs.com/package/auto-docs)


### Installing

* npm install -g testcafe
* npm install -g docsify-cli
* npm install --save-dev auto-docs

### In you package.json

```json

  "scripts": {
    "manual": "testcafe \"chrome:headless --kiosk --incognito --force-device-scale-factor=1.5\" node_modules/auto-docs/ -s docs/pics",
    "files": "node node_modules/auto-docs/",
    "serve": "docsify serve docs"
  }

```

**To generate with screenshots** `npm run manual`

also 

**To run without [brower commands](#brower-commands) use** `npm run files`

Once generated.

**To run document server** `npm run serve`

How you can open [localhost:3000](http://localhost:3000)


# Api

### brower commands

* navigateTo: go to a given url - (url)
* typeText: enter text into an input - (selecter,text)
* click: click on an element - (selecter)

### document commands

* description: Add basic text to document - (text)
* screenshot: Capture the screen and add to document - (screenshot_name,[diff]) ***diff** defult to `true`* check if the screen has chacked
* link: Add a link to document (title,url)
* img: Add a image to document (title,url)
* lang: apply translation from ##.json `` lang`message` ``
    * Injects new text into language json file if new/missing
    * generating of language json file if missing
    * With value passion recording. Used in language like *Arabic, Chinese, Hindi, Japanese etc..*
* code: Add a block of code to document (source,[type]) ***type** of optional*
* pageBreak: Add a link break to document () ~ No arguments
* title: Add a heading to document (text) or (level,text) *to set the depth of the sub heading*
* youtube: A thumbnail link to a video (video_id,[start from X sec]) ***start** of optional*
    * You will need a "playbutton.png" in your "pics" folder
    * You will also need the CSS to place the button

<details><summary>CSS: youtube button placement</summary><br>

Add this CSS
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

</details>

<details><summary>JS: embed youtube video</summary><br>

Add this index.html
```JS
window.$docsify = {

  plugins: [
   function (hook, vm) {
      hook.afterEach(function(html, next) {

        if(html.includes("youtube")){

            $(html).find("img[src*='youtube']").parent().toArray()
                                                        .map(elem => $(elem))
                                                        .forEach( elemA =>{

              const link  = elemA.attr("href")
              const [id ,time]   = link.split("/").pop().split("?")

              const start = time ? time.match(/\d+/)[0] : 0

              const elemToReplace = elemA.parent().html().replace(new RegExp(" data-origin=", "g"),"data-origin=")

              const newElem = `<iframe width="100%" height="433" src="https://www.youtube.com/embed/${id}?start=${start}" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>`
              html = html.replace(elemToReplace,newElem)

            } )

        }
        next(html)

      })
   }
 ]

// ...

}

```

</details>

## Config file

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
