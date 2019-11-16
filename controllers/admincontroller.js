const user 		= require('../mongoose').user 

let admincontroller = {}

admincontroller.errors = (req,res,next)=>{

	let auth = req.isAuthenticated() 
	let csrf = req.csrfToken()
	let rights = req.session.passport.user.rights

	if(!auth && rights!= 'owner')	res.redirect('/')

	let obj = {
		auth:auth,
		csrfToken: csrf,
	}

	//res.render('admin/error',obj)
}

module.exports = admincontroller