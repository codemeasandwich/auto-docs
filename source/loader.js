var fs = require('fs');
var path = require('path');

// Return a list of files of the specified fileTypes in the provided dir,
// with the file path relative to the given dir
// dir: path of the directory you want to search the files for
// fileTypes: array of file types you are search files, ex: ['.txt', '.jpg']
function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
       walkDir(curFile);
      }
    }
  };
  walkDir(dir);

  return filesToReturn;
}
const re = /(?:\.([^.]+))?$/;

function loader(dirname){


  return getFilesFromDir(dirname, ".js")
          .reduce((packages,file) =>{

            let pointer = packages;

            const pathParts = file.replace(re.exec(file)[0],"").split("/").slice(1)
            if(pathParts[pathParts.length-1] === "index")
            pathParts.pop()

            pathParts.forEach((path,index,{length}) => {

              if(length-1 === index)  {
                pointer[path] = require(`${dirname}/${file}`)
              } else if(0 === index ){
                if(! packages[path])
                    packages[path] = {}
                pointer = packages[path]
              } else {
                pointer = pointer[path] = pointer[path] || {}
              }
            })
            return packages;
          },{});

}

module.exports = loader
