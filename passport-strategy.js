const local 	= 	require('passport-local').Strategy
const rememberMe	=	require('passport-remember-me').Strategy 
const user 	    =	require('./mongoose').user 
const bcrypt 	= 	require('bcrypt') 
const crypto 	=	require('crypto')

module.exports = (passport) =>{
	//create localstrategy
	passport.use(new local((username,password,done) =>{

	user.findOne({
			username: 	username,
			active: 	true,
		},(err,doc) =>{
			console.log(doc)
			if(err) redirect('')

			if(doc != null)	{
			
				let valid = bcrypt.compareSync(password,doc.password)

				if(valid) next(null,{
					username: doc.username,
					password: doc.password,
				})/*done(null,{
					username: doc.username,
					password: doc.password,
				})*/
					else {
						console.log('pas is not valid')
						next(null,false)//done(null,false)
					}
			}
			else{
				console.log('doc is null')
				next(null,false)//done(null,false)
			} 
		})
	})) 
	//strategy remember me
	passport.use(new rememberMe({
			key:'token'
		},
		(token,done)=>{
			//find user with this token
			user
			.findOne({
			    autoLoginHash: token,//params of search
            },
            (err,doc)=>{
            	if(err) done(err)
            		else if(!doc) done(null,false)
            			else{
            				//delete token for protection
            					delete doc.autoLoginHash
                                doc.save(()=> {})
                                done(null, doc)
            			}
            })
		},
		(doc,done)=>{
			//genereate new token
			let token = crypto.randomBytes(32).toString('hex')
			doc.autoLoginHash = token
			//save new token
            doc.save(()=> {})
            done(null, token)

		}
	))

	passport.serializeUser((user,done)=>{
		done(null,user)
	}) 
	passport.deserializeUser((user,done)=>{
		done(null,user)
	}) 
}