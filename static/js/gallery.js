	 
  	let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  	let params = {
  		step : 0,
  	}


  	let  success = (data)=>{
  		//create elems
  		let elems = data.map((name)=>{

  		return '<a class="image-wrapper spotlight" href="/photo/'+name+'" data-order="'+params.dataOrder+'"><img class="image-thumb"src = "/photo/'+name+'"></a>'

  		})

  		let $gallery = $('#gallery')//here will be everything images
  		
  		let optionsGrid =	{
				rowHeight: 200,				// The minimum height you want each row of the grid to be
				margin: 10,				// The amount of pixels between each images
				imageSelector: '.image-thumb',		// The class name of the images in your grid
				maxLines: false,			// The maximum number of lines to show (false means all lines should be visible)
				showLastLine: true,			// Should the last line be hidden
				alignLastLine: 'left',			// How should the last line be aligned (only if it is visible). Should be set to justify when using maxLines or if showLastLine is false
				responsive: false,			// To disable the grid responsivness (default is true)
			}

  		$('.didntsave').remove()
  		//append them to #gallery
  		elems.forEach((item)=>{
  			$gallery.append(item)
  			$gallery.imagesGrid(optionsGrid).css({
  				'text-align':'letf',
  			})//render new photos
  		})

  		
  			
  		//show them for user
  		$gallery.imagesLoaded( { background: true }, function() {
  				$('#gallery img').animate({opacity:1},1000)
		})

  			$gallery.css('text-align','left')//back them to left side

  		++params.step

  		let winH = $(window).height()
  		let docH = $(document).height()

  		//load more if we can
  		if(winH == docH && elems.length != 0) $.ajax(optionsAjax)
  	}

  	let optionsAjax = {
	 	method:'post',
	 	url: '/collection',
        headers:{
                'CSRF-Token': token,
                },
        data:(params),
	 	success:success,
	}

	 $.ajax(optionsAjax)

	 //load new images

	 $(window).scroll(()=>{

	 	if($(window).scrollTop()+$(window).height()>=$(document).height()-50){
			$.ajax(optionsAjax)

		}
	 })




	 