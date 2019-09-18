const Multer = require('multer');
const Path 	 = require('path');


let photoStorage = Multer.diskStorage(
{

    destination: function (req, file, cb) {

        cb(null, 'static/uploads/photo')   
    },
    filename: function (req, file, cb) {
    	let ext = Path.extname(file.originalname);

    	cb(null, file.fieldname + '-' + Date.now()+ext)
  	}

}
);

let uploadImg = Multer(
	{ 
		storage: 	photoStorage,
		limits: 	{fileSize: 20*1024*1024},
		fileFilter: (req,file,cb) =>{
			let ext = Path.extname(file.originalname);

			if(ext != '.jpeg' && ext != '.jpg' && ext != '.png' && ext != '.gif' && ext != '.pjpeg' && ext != '.webp'){
				return cb(new Error(ext))
			}

			cb(null,true)
		},	
	}
	);

module.exports = {
	uploadImg: 	uploadImg,
};