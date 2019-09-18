let $wrapnav	=	$('.wrapper-nav')
let $menu		=	$('.both img')

let menuClick = ()=>{

	let stateMenu	=	$wrapnav.css('display')

	if(stateMenu == 'none'){
		$wrapnav.show(200,)
	}
	else $wrapnav.hide(200,()=>{
		$(this).css('display','none')	
	})

}
let changeMenu = ()=>{
	let windowWidth = $(window).width()
	if(windowWidth >= 756)	$wrapnav.css('display','block')
		else	$wrapnav.css('display','none')

}

$menu.on('click',menuClick)
$(window).on('resize',changeMenu)