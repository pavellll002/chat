const user 				= require('../mongoose').user 
const Image				= require('../mongoose').image
const Chaters 			= require('../mongoose').chaters;
let   uploadImg 		= require('../multer.js').uploadImg.single('image')
const fs 				= require('fs')
const mongoose 			= require('mongoose')

let addImage = (res,username,id,changePath)=>{

	user.updateOne({
		username:username,
	},
	{
		$push:{
			images: id,
		}
	},
	(err,doc)=>{

		if(err || doc.nModified == 0) {
			//if user didn't save id we delete file
				fs.unlink(changePath,(err)=>{
					console.log(err)
				})

				Image.deleteOne({
					_id:id,
				})
				res.end('Что-то пошло не так, попробуйте еще раз')
		}
		else res.end('Файл успешно сохранен')

	})
	
}

let saveFileInDB = (req,res,nameFile)=>{

	let changePath = './static/photo/'+nameFile
//check exist path in data base

	Image.findOne({
		path:nameFile,
	},
	(err,doc)=>{
		//if err 
		if(err) console.log(err)
		//if nothing was founded stop evrething
		else if(doc == null){
			//create new doc with image path
			let image = new Image({
  				_id: new mongoose.Types.ObjectId(),
				path: nameFile,				
			})

			//save this doc
			image.save((err)=>{
				if(err) console.log(err)

				//get username
				let username = req.session.passport.user.username
				//save image's id in db
				addImage(res,username,image._id,changePath)
			})
		}
		//if image's doc was found we don't save it
		else if(doc != null){
			//get images's id
			let _id = doc._id

			let	username = req.session.passport.user.username
			//we should check saved user this photo or not
			user.findOne({
				username: username,
				images: _id,
			},
			(err,doc)=>{
				if(err)	console.log(err)
					else if(doc != null)	res.end('Вы уже добавляли это фото')//that means that user already saved this photo
						else if(doc == null)	addImage(res,username,_id,changePath)//added user's photo to dependensis one to many

			})


		}

	})

}

let chatController = {}


chatController.add_to_gallery = (req,res)=>{

	let auth = req.isAuthenticated()

	if(!auth) return res.end('Эта функция доступна только зарегестрированным пользователям')


	let nameFile = req.body.path

	let path = './static/uploads/photo/'+nameFile

	let changePath = './static/photo/'+nameFile
	//if file is we save it in db
	fs.access(path,(err)=>{

		if(err)  res.end('Что-то пошло не так, попробуйте еще раз')

			else fs.access(changePath,(err)=>{

				//if change path isn't we save that in other file
				if(err){
					//copy file
					fs.copyFile(path,changePath,(err)=>{

						if(err) res.end('Что-то пошло не так, попробуйте еще раз')
							//if err wasn't we save path to image  in db
							saveFileInDB(req,res,nameFile)
						})

						
					}
					else	saveFileInDB(req,res,nameFile)

					})

			})
	
}

chatController.photo_save = (req, res)=> {

		let id = req.headers.io
	
		Chaters.findOne({
			io: id,
			pos: 2,
		},
		(err,doc)=>{
	
			if(err || doc == null)  res.end(0)//if file aren't saved we show that when send 0
	
		})

		uploadImg(req,res,(err) => {

			if(err) res.end(0) 
			console.log(req)
			let file = req.file 


			Chaters.findOneAndUpdate({
				io: id,
			},
			{
				$push:{
					img_path:file.filename,
				}
			},
			(err,doc)=>{
				if(doc != 0 || !err){

					//if photo was saved to user we should save that to another chater
					
					Chaters.findOneAndUpdate({
						io: doc.chat_io,
					},
					{
						$push:{
							img_path:file.filename,
						}
					},
					(err,doc)=>{
						if(err) console.log(err)

					})
					res.end(file.filename)//if file was upload succesfuly we send its filename

				}	 
					else {
						let paht = './static/uploads/photo/'+file.filename
						fs.unlink(path,(err)=>{
							console.log(err)
						})
						res.end(0)
					}
			}) 

		}) 
}

module.exports = chatController