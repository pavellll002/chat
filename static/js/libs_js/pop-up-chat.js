(function( $ ){ 

	$.fn.popup = function(text,options){

		let defaultOptions  = {
			head: 'Оповещение',
		}

		let settings = $.extend(defaultOptions,options)
		
		//hide latest added pop up
		let hidePopup = ()=>{

			let $last = this.find('.pop-up').first()

			$last.hide(200,()=>{
				$last.remove()
			})
		}
		//return elem
		return this.each(()=>{

			let $popup = this.find('.pop-up')

			let count = $popup.length
			//new pop up
			let el = '<div class="pop-up"><div class="pop-up-header"><div>'+settings.head+'</div><div class="exit">X</div></div><div class="notification">'+text+'</div></div></div>'
			//if popups are more then 2 we hide them
			if(count >= 2){

				let time = $popup.not(':last').hide(200,()=>{
					//remove popups
					$popup.not(':last').remove()

				}).each(function(){
					//remove timeouts
					clearTimeout($(this).attr('data-timeout'))

				})



				this.append(el)
			}
			else		this.append(el)

			let $lastPopUp =	this.find('.pop-up').last()
			
			//show popup
			$lastPopUp.show(200)


			//hide popup
			let hide = setTimeout(hidePopup,15000)
			
			//save data about timeout ,when popups will remove their timeout will remove too
			$lastPopUp.attr('data-timeout',hide)

			//add event listener which will close this popup if user click .exit
			$lastPopUp.find('.exit').on('click',function(){
				
				$lastPopUp.hide(200,()=>{
					$lastPopUp.remove()
				})

				clearTimeout(hide)
			})

		})
	}

})( jQuery )