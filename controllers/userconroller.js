const user 		= require('../mongoose').user 
const Image		= require('../mongoose').image
const crypto 	= require('crypto-random-string') 
const fs 		= require('fs')
const sendmail 	= require('sendmail')()
const mongoose = require('mongoose')

let   userController = {} 


userController.register = (req,res,next) => {

	let auth 	= req.isAuthenticated()

	if(auth) res.redirect('/')

	let nick	= req.body.login 
	let email	= req.body.email 
	let pas 	= req.body.pas 
	let pas1	= req.body.pas1 

	//check login
	check  = /^[A-Za-z0-9_-]{4,20}$/.test(nick) && nick.length != 0 

	//chekc pas
	check = check && pas == pas1 

	check = check && /^\S+$/.test(pas) 
	//chekc lenght pas
	check = check && (pas.length >= 6)

	//if data was wrong redirect route to singup
	if(!check)  return res.redirect('/singup?form=true') 

	//for this salt i'll check that user was activated
	let salt = crypto({length: 5, type: 'url-safe'}) 

	let body_mes = 'Добрый день, чтобы продтвердить свой аккаунт перейдите по  <a href = "https://clucker.ru/check-active/'+nick+'/'+salt+'">ссылке</a>.\nЕсли письмо пришло по ошибке удалите его. После подтверждения аккаунта вы сможете авторезироваться.' 
	

	let human = new user({
		username: 	nick,
		email: 	email,
		active: false,
		salt: 	salt,	
	})

	human.password = human.hashPassword(pas)

	human.save((err,doc)=>{

		if(err) return res.redirect('/singup?mail=false')

			sendmail({
			    from: "no-reply@clucker.com",
				subject: "",
				to:   email,
				html: body_mes,
				type: 'text/html',
			  }, 
			  	(err, reply) =>{
			    console.log('err mail',err && err.stack)
			    console.dir('reply mail',reply)

				}
			)
			console.log(body_mes)
			res.redirect('/singup?mail=true') 
	})
}  


userController.logout = (req,res) => {

	req.logout() 
	res.redirect('/') 
} 

userController.check = (req,res) => {
	let auth 	= req.isAuthenticated()

	if(auth) res.redirect('/')
		
	let nick = req.params['nick'] 
	let salt = req.params['salt'] 
	console.log(nick,salt)
	user.updateOne(
		{
			username:nick,
			salt:salt,
		},
		{
			active:true,
			salt: null,
		},
		(err,doc)=>{
			if(err) return console.log(err) 
			if(doc.nModified == 1)	res.redirect('/singup?check=true')
			else res.redirect('/singup?check=false') 
		}
	) 
} 

userController.isNick = (req,res) => {
	let auth 	= req.isAuthenticated()

	if(auth) res.redirect('/')
		
	let nick = req.body.login 
	console.log(nick)
	user.findOne({
		username:nick,
	},
	(err,doc)=>{
		if(err) return console.log(err) 
			console.log(doc)
		if(doc !=null ) res.render('layout/zero',{num:1})//if nick is 
			else res.render('layout/zero',{num:0})//if nick isn't
	}) 
} 

userController.isEmail = (req,res) => {
	let auth 	= req.isAuthenticated()

	if(auth) res.redirect('/')
		
	let email = req.body.email 
	console.log(email)

	user.findOne({
		email:email,
	},
	(err,doc)=>{

		if(err) return console.log(err)

		if(doc != null ) res.render('layout/zero',{num:1})  //if email is 
			else res.render('layout/zero',{num:0}) //if imail isn't

	}) 
} 

userController.singup = (req,res) => {
	//show user all mistakes and events
	let auth = req.isAuthenticated() 
	let mail = req.query.mail 
	let form = req.query.form 
	let fail = req.query.fail 
	let check = req.query.check
	let csrf =  req.csrfToken()

	if(auth)  res.redirect('/')

	let obj = {
		auth : auth,
		mail : mail,
		form : form,
		fail : fail,
		check: check,
		csrfToken: req.csrfToken(),
	} 
	
	res.render('singup',obj) 

} 

userController.chat = (req,res)=>{

		let auth = req.isAuthenticated() 
		let csrf = req.csrfToken()
		let sess = req.session

		let obj = {
			auth: auth,
			csrfToken: csrf,
		} 

			res.render('index',obj) 
}

userController.gallery = (req,res)=>{

	let auth = req.isAuthenticated()
	let csrf = req.csrfToken()

	if(!auth) res.redirect('/')

	let obj = {
		auth: auth,
		csrfToken:csrf,
	}

	res.render('gallery',obj)
}

userController.collection = (req,res)=>{

	let auth = req.isAuthenticated()

	if(!auth) res.end()//if user isn't auth

	let username = req.session.passport.user.username
	let step = req.body.step

	step = parseInt(step,10)


	if(typeof step != 'number') res.end()//if data was wrong

	let take = 20
	let skip = step*take

	user.findOne({
		username: username,
	},
	{
		images:{
			$slice:[skip,take],//needed array of photo's path
		}
	}).populate('images').exec((err,doc)=>{

		if(err){
			console.log(err)
			res.end()
		} 


			let arrTemp = []//save a names of files

			for(let image of doc.images){

				arrTemp.push(image.path)
			
			}


			res.send(arrTemp)//send paths
	})


}

userController.settings = (req,res)=>{

	let auth = req.isAuthenticated()
	let csrf = req.csrfToken()

	if(!auth) res.redirect('/')

	let obj = {
		auth: auth,
		csrfToken:csrf,
	}

	res.render('settings',obj)
}

userController.politika = (req,res)=>{

	let auth = req.isAuthenticated()
	let csrf = req.csrfToken()

	let obj = {
		auth: auth,
		csrfToken:csrf,
	}

	res.render('rules/politika',obj)
}

userController.agreement = (req,res)=>{

	let auth = req.isAuthenticated()
	let csrf = req.csrfToken()

	let obj = {
		auth: auth,
		csrfToken:csrf,
	}

	res.render('rules/agreement',obj)
}





module.exports = userController 