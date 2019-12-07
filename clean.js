const Chaters = require('./mongoose').chaters
const Users   = require('./mongoose').user
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

Users.findOne({},(err,result)=>console.log(err,result))

}

//clean files
clean.files = ()=>{
    let path  = './static/uploads/photo'
/*    //crate place for saving photos temp
    fs.access(path,(err)=>{
        if(err) fs.mkdirSync(path)
    })

    //create dir for saving photo into database
    let realPath = './static/photo'

    fs.access(realPath,(err)=>{
        if(err) fs.mkdirSync(realPath)
    })
    */
	let files = getFiles(path)//get all files
	//delete them
	for(file of files){
	
		//delete photo
		fs.unlink(file,(err)=>{
			if(err) console.log(err)
		})
	}
}

clean.users = ()=>{

    Users.remove({},(err,doc)=>{
        console.log('err',err)
        console.log('user remove: ',doc)
    })

}
module.exports = clean