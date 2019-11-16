const user 		= require('../mongoose').user 
const log 		= require('../mongoose').log 

let admincontroller = {}

admincontroller.errors = (req,res,next)=>{

	let auth = req.isAuthenticated() 
	let csrf = req.csrfToken()

	if(!auth)	return	res.redirect('/')


	let rights = req.session.passport.user.rights

	if(rights!= 'owner') return	res.redirect('/')
	console.log(log.find({}).sort({date:-1}).limit(5).exec())
	let obj = {
		auth:auth,
		csrfToken: csrf,
	}

	res.render('admin/error',obj)
}

module.exports = admincontroller