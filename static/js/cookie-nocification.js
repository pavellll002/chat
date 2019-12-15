let cookieOk = Cookies.get('cookieOk')

if(!cookieOk){
	let cookieNotification = document.createElement('div')
	cookieNotification.className = 'cookie-notification'
	cookieNotification.innerHTML = `
			<div class="cookie-used">Мы используем файлы 	
					<a href="/cookie">куки.</a>
			</div>
			<div id="cookie-ok">ok</div>`
	document.getElementsByClassName('main')[0].appendChild(cookieNotification)
	cookieNotification.children[1].addEventListener('click',function(event){
		event.stopPropagation()
		Cookies.set('cookieOk','true',{ expires: 1065})
		cookieNotification.remove()
	})
}
