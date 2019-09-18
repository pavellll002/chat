const Chaters = require('./mongoose').chaters
const fs = require('fs')
const path = require('path')

var getFiles = function (dir, files_){
    
  files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

let clean	=	{}
//clean chaters
clean.chaters = ()=>{

Chaters.remove({},function(err, result){
     
    if(err) return console.log(err)
     
    console.log(result)
})

}

//clean files
clean.files = ()=>{
	let files = getFiles('./static/uploads/photo')//get all files
	//delete them
	for(file of files){
	
		//delete photo
		fs.unlink(file,(err)=>{
			if(err) console.log(err)
		})
	}
}

module.exports = clean