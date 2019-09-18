const mongoose 	=	require('mongoose') 
const bcrypt 	=	require('bcrypt') 
const	env		=	require('dotenv').config().parsed

mongoose.set('useFindAndModify', false) 

//open connection
mongoose.connect('mongodb://'+env.PORT_DB+'/'+env.NAME_DB, { useNewUrlParser: true }) 
//set object shema
const Schema = mongoose.Schema 
//templates
let typeAges = {
	type: Number,
	min:14,
	max:99,
	default:14,
} 

let typeSex = {
	type: Number,
	min:0,
	max:1,
	default:0,
} 


//set shema chaters
const chaterShema = new Schema({
	io:{
		type:String,
		unique:false
	
	},
	you:typeSex,
	intel:[typeSex],
	ages:[typeAges],
	pos:{
		type:Number,
		default:0
	},
	chat_io:{
		type:String
	},
	img_path:[String],
}) 

//set shema user

const userShema = new Schema({
	username: 	{
		type: String,
		unique: true,
	},
	password: 	String,
	email: 		{
		type: String,
		unique: true,
	},
	salt: 		String,
	active: 	Boolean,
	images: 	[{
		type: 	Schema.Types.ObjectId,
		ref: 	'image',
	}]
})

//set image shema

const imageShema = new Schema({
	_id: 	Schema.Types.ObjectId,
	path: 	{
		type: String,
		unique: true,
	},
}) 



//methods

//user
userShema.methods.hashPassword = (password)=>{
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userShema.methods.comparePassword = (password,hash)=> {
	return bcrypt.compareSync(password,hash)
}


//exrort shema
module.exports = {
	chaters: 	mongoose.model('chater',chaterShema),
	user: 		mongoose.model('user',userShema),
	image: 		mongoose.model('image',imageShema),
} 
