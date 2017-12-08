
var fs = require('fs');

fs.readdir('./docs', (err, files)=>{
  files.forEach(file=>{
      if(file.endsWith("md")){
        const path = './docs/'+file
        console.log("Removing: " +path)
        fs.unlinkSync(path);
      }
  })
});


fs.readdir('./docs/pics', (err, files)=>{
  files.forEach(file=>{
      if(file.endsWith("png")){
        const path = './docs/pics/'+file
        console.log("Removing: " +path)
        fs.unlinkSync(path);
      }
  })
});
