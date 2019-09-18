const local 	= 	require('passport-local').Strategy 
const user 	    =	require('./mongoose').user 
const bcrypt 	= 	require('bcrypt') 

module.exports = (passport) =>{
	//strategy
	passport.use(new local((username,password,done) =>{
	console.log(password)
	user.findOne({
		username: 	username,
		active: 	true,
	},(err,doc) =>{

		if(err) redirect('')

		if(doc != null)	{
			
			let valid = bcrypt.compareSync(password,doc.password)

			if(valid) done(null,{
				username: doc.username,
				password: doc.password,
			})
				else {
					console.log('pas is not valid')
					done(null,false)
				}
		}
		else{
			console.log('doc is null')
			done(null,false)
		} 
	})
})) 
	passport.serializeUser((user,done)=>{
		done(null,user)
	}) 
	passport.deserializeUser((user,done)=>{
		done(null,user)
	}) 
}