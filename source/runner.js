import { Selector } from 'testcafe';
import { exec } from 'child_process';
require('./bootstrap');

const _dirname = __dirname.split('/').slice(0,-3).join('/')
console.log(_dirname)
const config     = require(_dirname+'/manual/config.json');
const fs     = require('fs');
const loader = require('./loader');

const deepFile = loader(_dirname+'/manual')//require('./manual/index.js');
//console.log(deepFile)
const manual = []
for(const heading in deepFile){

  if("function" === typeof deepFile[heading]){

    deepFile[heading]._ = deepFile[heading]._ || {}
    deepFile[heading]._.nav = { pageName:heading }
    if("cover" === heading)
      manual.unshift(deepFile[heading])
    else
      manual.push(deepFile[heading])
  }else
  for(const pageName in deepFile[heading]){

    deepFile[heading][pageName]._ = deepFile[heading][pageName]._ || {}
    deepFile[heading][pageName]._.nav = { heading, pageName }

    manual.push(deepFile[heading][pageName])
  }
}
//console.log(manual)


const helper = require("./helper")

fixture`Started`.page``;


let mds = {}
let currentPage = "README"
function headerMD(nav){
  //console.log(nav)
  currentPage = nav.heading ? `${nav.heading}⮕${nav.pageName}` : nav.pageName

}


function done(){

    // Copy images to docs
    exec(`cp -r ${_dirname}/manual/pics  ${_dirname}/docs`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(`err: ${err}`);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
    });

    const sideItems = Object.keys(mds)

    mds.README = mds[sideItems[0]]
    sideItems[0] = "README"

    sideItems.forEach((pageName, i) => {
      fs.writeFile(`./docs/${pageName.replace(/⮕\d/,"")}.md`,
                   mds[pageName],
                   err => err ? console.error(err)
                              : console.log("The file was saved!", `./docs/${pageName.replace(/⮕\d/,"")}.md`));
    }) // END sideItems.forEach

    sideItems.shift()

    const groups = sideItems.reduce((groups,sideItem)=>{
      const [groupName,pageName] = sideItem.split("⮕")
      groups[groupName] = groups[groupName] || []
      const [position,name] = pageName.split("-")
      groups[groupName][position-1] = {name:name,path:sideItem.replace(/⮕\d/,"")}
      return groups
    },{})
    //console.log(groups)

    let sidebarContent = ""

const groupArray = [];

for(const groupsName in groups){
  const [index,groupName] = groupsName.split("-");
  groupArray[index] = {    groupsName,    groupName  }
}

groupArray.forEach(({ groupsName, groupName })=>{
  sidebarContent += `
- ${groupName}`
  for(const pageName of groups[groupsName]){
  sidebarContent += `
  - [${pageName.name}](${pageName.path})
  `
  }
})


    fs.writeFile(_dirname+"/docs/_sidebar.md",
                  sidebarContent
                /*  sideItems.map((pageName, i)=>`- [${pageName}](${pageName.replace(/⮕\d/,"")}.md)`)
                          .join("\n")*/,
                  err => err ? console.error(err)
                             : console.log("The file was saved!","./docs/_sidebar.md"))


} // END done




const manualClean = manual.map(page=>{
  const aHelper = new helper;
  page(function createPage( fillCommandArray, url ){
    aHelper.header("")
    fillCommandArray();
    aHelper._.url   = url
  },aHelper)
  return Object.assign({},aHelper._,page._);
})


let taskCounter = 0

manualClean.forEach(async (page, index, {length}) =>{

//console.log(" ++++ ",page)
  if(page.url){
    let url = config.server + config.login.url, commands = page.commands

      if(page.url !== config.login.url){
        const aHelper = new helper;
        aHelper.typeText(config.login.user[0], config.login.user[1])
        aHelper.typeText(config.login.pass[0], config.login.pass[1])
        aHelper.click(config.login.button)
        aHelper.navigateTo(page.url)
        commands = aHelper._.commands.concat(commands)
      }


      test.page(url)(page.nav.pageName, async t => {

        for(const task of commands){

          if(task.run){
            if(task.selecter)
            await t[task.type](task.selecter,task.value)
            else
            await t[task.type](task.value)
          }else {
            nonTest(task,index,page.nav)
          }
        }

        taskCounter++
        if(taskCounter === length) done()

      })
  } else {
    for(const task of page.commands){
        nonTest(task,index,page.nav)
    }
    taskCounter++
    if(taskCounter === length) done()
  }
})

function nonTest(task,index,nav){
  switch(task.type){
    case "header":
      //console.log("Building: ",task,index,nav)
        headerMD(nav)
      break;
    default:
      mds[currentPage] = mds[currentPage] || ""
      mds[currentPage] = mds[currentPage] + task.value

  }
}
