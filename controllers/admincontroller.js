const user 		= require('../mongoose').user 
const log 		= require('../mongoose').log 

let admincontroller = {}

admincontroller.errors = async (req,res,next)=>{

	let auth = req.isAuthenticated()
	let csrf = req.csrfToken()
	let logs = await log.find({}).sort({date:-1})/*.limit(5)*/.exec()
	let obj = {
		auth:auth,
		csrfToken: csrf,
		logs: logs,
	}

	res.render('admin/error',obj)
}

admincontroller.pageUsers = async (req,res,next)=>{

	let auth = req.isAuthenticated()
	let csrf = req.csrfToken()
	let obj = {
		auth:auth,
		csrfToken: csrf,
	}

	res.render('admin/users',obj)	

}

admincontroller.redirectPageUsers = async (req,res,next)=>{

	res.redirect('/users/0')	

}

admincontroller.getUsers = async (req,res,next)=>{
	
	let page = parseInt(req.query.page,10)
	let group = 30
	let users = await user.find({}).sort({images:1}).skip(group*page).limit(group).exec()
	let count = await user.count({}).exec()
	let obj = {}
	
	users = JSON.stringify(users)
	console.log(users)
	obj.users = users
	obj.count = count
	obj.group = group

	res.send(obj)

}

module.exports = admincontroller