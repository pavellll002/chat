const AdminUtils = {}

AdminUtils.rights = (req,res,next)=>{
	let auth = req.isAuthenticated()
	if(!auth || req.session.passport.user.rights != 'owner')	return	res.send('404')
		else next()
}

module.exports = AdminUtils