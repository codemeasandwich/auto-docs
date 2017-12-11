function helper(){

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
      commands.push({
        type:"wait", run:true, value:1200 // wait for animations
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

  this._ = {
    commands : commands
  }
}

module.exports = helper
