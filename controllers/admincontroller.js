const user 		= require('../mongoose').user 

let admincontroller = {}

admincontroller.errors = (req,res,next)=>{

	let auth = req.isAuthenticated() 
	let csrf = req.csrfToken()

	if(!auth)	return	res.redirect('/')


	let rights = req.session.passport.user.rights

	if(rights!= 'owner') return	res.redirect('/')

	let obj = {
		auth:auth,
		csrfToken: csrf,
	}

	res.render('admin/error',obj)
}

module.exports = admincontroller