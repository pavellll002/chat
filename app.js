const express = require('express') 
const app 	  = express() 
const jsonParser = express.json() 
const csrf 	  = require('csurf')
const Ddos	  = require('ddos')

const passport 			= require('passport') 
const expressSession 	= require('express-session')
const fileStore 		= require('session-file-store')(expressSession) 
const cookie 			= require('cookie-parser') 
const body 				= require('body-parser')


const userController 	= require('./controllers/userconroller.js')
const chatController 	= require('./controllers/chatcontroller.js') 
const admincontroller	= require('./controllers/admincontroller.js')
const settingsController 	= require('./controllers/settingscontroller.js') 
const passportSt 		= require('./passport-strategy.js')
const utilAdmin 		= require('./utils/utiladmin.js')
const csrfProtection 	= csrf({ cookie: true }) 
const ddos 				= new Ddos({burst:10, limit:50, maxcount:10})
let fileStoreOptions 	= {}

	app.use(express.static(__dirname + "/static")) 

	app.use(expressSession({
		store: new fileStore(fileStoreOptions),
		secret: 'pureLab',
		resave: false,
    	saveUninitialized: false,
    	httpOnly: true,
    	cookie:{
    		expires: new Date(Date.now() + 1000*60*60*24*365),
    	}
	})) 
	app.use(ddos.express)
	app.use(cookie()) 
	app.use(body.urlencoded({ extended: true })) 
	app.use(body.json()) 

	app.use(passport.initialize()) 
	app.use(passport.session())
	app.use(passport.authenticate('remember-me'))

	//auth
	passportSt(passport)

	//engine
	app.set("view engine","ejs") 

	//get routs
	//chat rout
	app.get('/',csrfProtection,userController.chat)

	//route regestration
	app.get('/singup',csrfProtection,userController.singup) 

	//route check that user is actived
	app.get('/check-active/:nick/:salt',userController.check) 

	//logout
	app.get('/logout',userController.logout)
	//galary
	app.get('/gallery',csrfProtection,userController.gallery) 
	//settings
	app.get('/settings',csrfProtection,userController.settings)
	//rules
	app.get('/politika',csrfProtection,userController.politika)

	app.get('/agreement',csrfProtection,userController.agreement)

	app.get('/cookie',csrfProtection,userController.cookie)
	//log of errors
	app.get('/error',csrfProtection,utilAdmin.rights,admincontroller.errors)
	//page of users
	app.get('/users/:page',csrfProtection,utilAdmin.rights,admincontroller.pageUsers)
	//redirect to users
	app.get('/users',csrfProtection,utilAdmin.rights,admincontroller.redirectPageUsers)
	//list of users
	app.get('/get-users',csrfProtection,utilAdmin.rights,admincontroller.getUsers)

	//post routs

	//register
	app.post('/register',csrfProtection,userController.register) 

	//login
	app.post('/login',csrfProtection,passport.authenticate('local', {failureRedirect: '/singup?fail=true',successRedirect: '/' })) 

	app.post('/checklogin',jsonParser,csrfProtection,userController.isNick) 

	app.post('/checkemail',jsonParser,csrfProtection,userController.isEmail) 

	app.post('/save_to_gallery',jsonParser,csrfProtection,chatController.add_to_gallery)

	//load an image from ajax form
	app.post('/photo/save',csrfProtection,chatController.photo_save) 

	//send photo to user from his collection
	app.post('/collection',userController.collection)

	//settings

	//change login
	app.post('/change-login',csrfProtection,settingsController.changelogin)

	//change password
	app.post('/change-password',csrfProtection,settingsController.changepassword)

	app.use(function(req, res, next) {
  		res.status(404).send('404')
	}) 
	
module.exports = function() {
	return app 
}