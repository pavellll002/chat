const user 		= require('../mongoose').user 
const log 		= require('../mongoose').log 

let admincontroller = {}

admincontroller.errors = async (req,res,next)=>{

	let auth = req.isAuthenticated() 
	let csrf = req.csrfToken()

	if(!auth)	return	res.redirect('/')


	let rights = req.session.passport.user.rights
	console.log(rights)
	if(rights!= 'owner') return	res.redirect('/')

	let logs = await log.find({}).sort({date:-1})/*.limit(5)*/.exec()
	console.log(logs)
	let obj = {
		auth:auth,
		csrfToken: csrf,
		logs: logs,
	}

	res.render('admin/error',obj)
}

module.exports = admincontroller