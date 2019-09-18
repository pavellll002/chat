const user 		=	require('../mongoose').user 
const bcrypt 	= 	require('bcrypt') 

let settingsController = {}

//path for changing login
settingsController.changelogin = (req,res)=>{

let auth = req.isAuthenticated()

if(!auth) return res.end('Вы должны быть зарегестрированы')

//params
let username 	=	req.body.username
let newUsername	=	req.body.newUsername
let password 	=	req.body.password

//checking new username is correct

let checkNewUsername  = /^[A-Za-z0-9_-]{4,20}$/.test(newUsername) && newUsername.length != 0 

if(!checkNewUsername) return res.end('Новый лоин не коректен, используйте только числа и латиницу')

//find user in db
user.findOne({
	username: username,
},
(err,doc)=>{
	//if err name was wrong
	if(err || doc == null) return res.end('Не правильно введен логин или пароль')
		else {
			//check password on valid
			let valid = bcrypt.compareSync(password,doc.password)
			//if password is correct
			if(valid){
				user.updateOne({
					username:username,
				},
				{
					username:newUsername,
				},
				(err,doc)=>{
					//result of updating login
					if(err) return res.end('Что-то пошло не так, попробуйте еще раз')
						else{
							req.session.passport.user.username = newUsername//save in session new username
							console.log(req.session)
							return res.end('Логин успешно изменнен')
						}
				})

			}
			//if password isn't correct
			else return res.end('Не правильно введен логин или пароль')
		}
})

}


//path changing pas
settingsController.changepassword = (req,res)=>{

	let auth = req.isAuthenticated()

	if(!auth) return res.end('Вы должны быть зарегестрированы')

	//params
	let username 		=	req.session.passport.user.username
	let lastPassword	=	req.body.lastPassword
	let newPassword		=	req.body.newPassword 
	
	//checking correctly of new password 
	let check = /^\S+$/.test(newPassword) && (newPassword.length >= 6)

	if(!check) return res.end('Введены не корректный данные, попробуйте еще раз')

	user.findOne({
		username:username,
	},
	(err,doc)=>{
		if(err ||doc == null) return res.end('Что-то пошло не так, попробуйте еще раз')
			else{

			//check password on valid
			let valid = bcrypt.compareSync(lastPassword,doc.password)

			if(valid){
				//create hash of new password
				let hashPas = bcrypt.hashSync(newPassword,bcrypt.genSaltSync(10))
				//change password if old pas was correct
				user.updateOne({
					username:username,
				},
				{
					password:hashPas,
				},
				(err,doc)=>{
					if(err) return res.end('Что-то пошло не так, попробуйте еще раз')
						else{
							req.session.passport.user.password = hashPas
							console.log(req.session)
							return res.end('Пароль успешно изменнен')
						}
				})
			}
			else  return res.end('Введены не корректный данные, попробуйте еще раз')//if pas wasn't correct

			}
	})
}

module.exports = settingsController