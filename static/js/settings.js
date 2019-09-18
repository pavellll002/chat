const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

let $changeLogin =	$('#changeLogin')

let $changeEmail =	$('#changeEmail')

let $changePas =	$('#changePas')

const success = (params)=>{
	//show message
	$('.pop-up-wrapper').popup(params)
}

//ajax for the changelogin

let clickLogin = ()=>{

//params
let username =		$('.changeLogin input[name="username"]').val().trim()
let newUsername =	$('.changeLogin input[name="newUsername"]').val().trim()
let password	=	$('.changeLogin input[name="password"]').val().trim()


let objLogin = {
	username:username,
	newUsername:newUsername,
	password:password,
}

//data for ajax form
let obj = {
	method:'post',
	url: '/change-login',
    headers:{
              'CSRF-Token': token,
            },
    data:(objLogin),
	success:success,
}

//ajax form
$.ajax(obj)

}

//ajax form for changing password

let clickPas = ()=>{

//params
let lastPassword	=	$('.changePas input[name="lastPassword"]').val().trim()
let newPassword		=	$('.changePas input[name="newPassword"]').val().trim()


let objPas = {
	lastPassword:lastPassword,
	newPassword:newPassword,
}

//data for ajax form
let obj = {
	method:'post',
	url: '/change-password',
    headers:{
              'CSRF-Token': token,
            },
    data:(objPas),
	success:success,
}

//ajax form
$.ajax(obj)

}

//clicks
$changeLogin.on('click',clickLogin)

$changePas.on('click',clickPas)