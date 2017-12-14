const fs = require('fs');
const _dirname = __dirname.split('/').slice(0,-3).join('/')
const config = require(_dirname+'/manual/config.json');

const supportedLangs = config.lang && [config.lang] || []

const translated = supportedLangs.reduce((supported,lang)=>{
    const path = _dirname+'/manual/'+lang+'.json'
    if (fs.existsSync(path)) {
       supported[lang] = require(path)
    } else {
      supported[lang] = {}
    }
    return supported
},{})

function helper(groupName,pageName=undefined,language="?"){

  const commands = []

  this.header = function(txt){
    commands.push({
      type:"header", run:false, value:txt
    })
    return this
  }

  this.description = function(txt) {
      commands.push({
        type:"txt", run:false, value:`
${txt}

`
      })
      return this
  }
  this.navigateTo = function(url){

    commands.push({
      type:"navigateTo", run:true, value:url
    })
    return this
  }

  this.screenshot = function(name,diff=true) {
      name = name.replace(/ /g,"_");
      if(config.waitBeforeScreenShot)
      commands.push({
        type:"wait", run:true, value:config.waitBeforeScreenShot // wait for animations
      })
      commands.push({
        type:"saveScreenshot", run:false, value:`
![${name.replace(/_/g," ")}](pics/${name}.png)
`
      })
      commands.push({
        type:"takeScreenshot", run:true, value:name, diff
      })
      return this
  }

  this.typeText = function(selecter,inputText) {
      commands.push({
        type:"typeText", run:true, value:inputText, selecter:selecter
      })
      return this
  }

  this.youtube = function(id,start){
      let url = `https://youtu.be/${id}`
      if(start)
        url += `?t=${start}s`

      commands.push({
        type:"videoLink", run:false, value:`
[![video](https://img.youtube.com/vi/${id}/maxresdefault.jpg)](${url})
![videobutton](/pics/playbutton.png)
` })
      return this
  }

  this.click = function(selecter) {
      commands.push({
        type:"click", run:true, selecter:selecter
      })
      return this
  }

  this.link = function(title,url){
      commands.push({
        type:"link", run:false, value:`
[${title}](${url})
`
      })
      return this
  }
  this.img = function(title,url){
      commands.push({
        type:"img", run:false, value:`
![${title}](${url})
`
      })
      return this
  }
  this.code = function(source,type=""){
      commands.push({
        type:"code", run:false, value:`
${"```"+type}
${source}
${"```"}
`
      })
      return this
  }

  this.pageBreak = ()=>{
    this.description("---")
    return this
  }

  this.title = (level, titleText)=>{

    if(isNaN(level)){
      titleText = level,
      level = 1
    }

    this.description(`${"#".repeat(level)} ${titleText}`)
    return this
  }

  this.lang = (text,...values)=>{

     if(!Array.isArray(text)){
       text = [text]
     }
    //language = "fr"
    translated[language] = translated[language] || {}
    translated[language][groupName] = translated[language][groupName] || {}
    if(pageName){
      translated[language][groupName][pageName] = translated[language][groupName][pageName] || {}
    }
    const pageContent = (pageName) ? translated[language][groupName][pageName] : translated[language][groupName]


    //if(language)
    const key = text.reduce((txt, value, index)=>{
      return txt+`${value} ${index < values.length ? `#${index}!`:""} `
    },"").trim()

    let words = text, valueOrder = Array.from(Array(values.length).keys())

    if(pageContent[key]){
      const output = pageContent[key]
      .split(/\s{1}#([0-9]+)!\s{1}/g)
      .reduce( (output, val, index) => {
          output[index % 2 === 0 ? "words":"values"].push(val)
          return output
      } , {words:[],values:[]} )
      words      = output.words;
      valueOrder = output.values;
    } else {
      pageContent[key] = key
    }

  //  if(Array.isArray(text)){
      text = words.reduce((txt, value, index)=>{
        return txt + value + (values[valueOrder[index]] ?  values[valueOrder[index]] : "")
      },"")
    //}

    return text
  }


  this._ = {
    commands,
    translated
  }
}

module.exports = helper
