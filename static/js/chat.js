
    //Cookies.remove('ban');
    const socket = io('https://clucker.ru/chat');
    

	
  $(window).resize(()=>{
    let data_user = $('.data-user').css('display');

    if(data_user == 'block' ) heightMain(document);

  });
  $(window).resize(()=>{
    let data_user = $('.data-user').css('display');

    if(data_user != 'block' ) heightWaiting();

  });
	$(document).ready(heightMain());	
	$(document).ready(limit_user);
  $(document).ready(check_for_ban);
  $(document).ready(set_data_users);
  $(document).ready(add_chating_file);

  
  function heightMain(log = document){
    
    $('.main').css('height',$('.main-inner').height()+'px');

    let data_user = $('.data-user').css('display');
    
    if(data_user != 'block' ) log = window;

    console.log(log+'log')
    let hS = $(log).height();
    
    let needh = $('header').height();
    let hb = hS-needh+'px';

    $('.main').css('height',hb);
     
  }

  function heightWaiting(wait = '.waiting'){
    let data_user = $('.data-user').css('display');
    heightMain();
    if(data_user != 'block' ){
    
    let chating = $('.chating').css('display');

    if(chating == 'block') wait = '.chating'; 
    
    let hS = $(window).height();

    let needh = $('header').height();
    
    let begin = $('#begin').height();
    
    console.log('begin',begin)
    
    let hb = hS-needh-begin+'px';
    
    $(wait).css('height',hb);
    
    if(wait == '.chating'){
      
      //height_area_of_message();
      scrollbar();
      set_h_for_cl_message();
    } 
  }
  }
	//ограничиваем пользователя
  function limit_user(){
      //check your sex
      $('.you_age .sex>:button').click(function(){
        add_class_check_you($(this),'.you_age .sex>:button');
      });
      //check sex of intelocutor
      $('.neigbor_age .sex>:button').click(function(){
         add_class_check_intel($(this));
       });
      
  }

  function set_data_users() {
    let data_user = Cookies.get('data_user'); 
    if(data_user == undefined)return false;

    data_user = JSON.parse(data_user);

    let age = data_user.ages;
    let sex = data_user.sex.you;
    let sex_i = data_user.sex.intelocutor;

    let $ages = $('.old>input');

    $ages.each(function(i,elem) {
      elem.value = age[i]; 
    });

    for(let v of sex){
  
      $('.you_age .sex [data-index ="'+v+'"]').addClass('check');
  
    }

    for(let v of sex_i){
      $('.neigbor_age .sex [data-index ="'+v+'"]').addClass('check');
    }


  }


  //add you class check
  function add_class_check_you($its,str){
        $(str).removeClass('check');
        $its.addClass('check');
  }
  
 //add class check for intelocutor
 function add_class_check_intel($its){
  $its.toggleClass('check');
 }


   //start chat
   var collectData = function(){
      var anon = check_anon();
        
   		var you_sex = get_data_you('.you_age .sex button','.you_age .sex .check');

   		var ages = get_age('.old>input');

   		var intelocutor_sex = get_data('.neigbor_age .sex button','.neigbor_age .sex>.check');

   		sendData(you_sex,intelocutor_sex,ages,anon);

     };

     function sendData(ys,is,ages,anon){
            let obj = {
                sex:{
                  you:ys,
                  intelocutor:is
                },
                ages:ages
            };
            Cookies.set( 'data_user', obj, { expires: 365});
            socket.emit('search',obj);
          }
      

     function check_anon(){
          if($('.but_start>li').is('.anon')){
           return $('#an').prop('checked');
          }
          else return 0;
        }


     function get_data(path,path1){
             var ar_sex = [];
             if($(path).is('.check')){
               $(path1).each(function(){
           ar_sex.push($(this).attr('data-index'));
           });
               return ar_sex;
          }
          else{
            $(path).animate({color:'#e94a54',borderColor:'#e94a54',borderWidth:'2px'},4000).animate({color:'#333',borderColor:'#ccc',borderWidth:'1px'},3000);
            return false;
          } 
      }


      function get_data_you(path,path1){
        if($(path).is('.check')){
            return $(path1).attr('data-index');
        }
        else{
          $(path).animate({color:'#e94a54',borderColor:'#e94a54',borderWidth:'2px'},4000).animate({color:'#333',borderColor:'#ccc',borderWidth:'1px'},3000);
          return false;
        } 
      }


      function get_age(path) {
      let $obj = $(path);
      let ages = $obj.map(function(i,elem) {
        return elem.value;
      }).get();
      //get bad elements
      let $wrong_obj = $obj.map(function(i,elem,) {
        let age = elem.value;
        /*if(i == 0 && age != '' && (isNaN(age) || age < 5) ){
          bootbox.dialog({
            message:'<div>Ты шутишь? Это <b>'+age+'</b> серьезно твой возраст?</div>'
          });
        }
        else */if(isNaN(age) || age < 14 || age > 99 || age == ''){
          return elem;
        }
      });

      if($wrong_obj.length > 0){
        $wrong_obj.val('').animate({color:'#e94a54',borderColor:'#e94a54',borderWidth:'2px'},4000).animate({color:'#333',borderColor:'#ccc',borderWidth:'1px'},3000);
        return false;
      }
      else if(ages[1] > ages[2]){
        $obj.not(':first').val('').animate({color:'#e94a54',borderColor:'#e94a54',borderWidth:'2px'},4000).animate({color:'#333',borderColor:'#ccc',borderWidth:'1px'},3000);
        return false;
      }
      else{
        return ages;
      }
       
       
      }


      function ban_for_age(path) {
        let $obj = $(path);
        let age = $obj.map(function(i,elem) {
            return elem.value;
        }).get();
        if(!isNaN(age) && (age > 5  && age < 14)){
          bootbox.confirm({
            message:'<div>Вы уверены что ваш возраст '+age+' лет?</div>',
            buttons:{
              confirm:{
                label:'Да',
                className: 'btn-success',
              },
              cancel:{
                label:'Нет',
                className: 'btn-danger'
              }
            },
            closeButton:false,
            callback: function(result,age) {
              if(result){
                let time_ban = 14 - age;
                mes_for_ban();
                Cookies.set('ban',true,{expires:365*time_ban});
              }
            }
          });
        }
      }


      function mes_for_ban() {
        $('.main-inner').empty();
        bootbox.dialog({
          message:'Простите, но политика сайта не разрешает лицам не достигшим 14 лет пользоваться нашими услугами.'
        });
      }


      function check_for_ban() {
        let ban = Cookies.get('ban');
        if(ban){
          mes_for_ban();
        }
      }


      //we don't give to chat a user if data is empty
      function checking_for_empting(){

        ban_for_age('.old>input:first');

        var you_sex = get_data_you('.you_age .sex button','.you_age .sex .check');

        var intelocutor_sex = get_data('.neigbor_age .sex button','.neigbor_age .sex>.check');


        var ages = get_age('.old>input');

        if(ages === false || you_sex === false ||  intelocutor_sex === false)return true;
        else return false;
      }
     $('#start').on('click',begin_chat);
     function begin_chat(){
      if(!checking_for_empting()){
        collectData();
      }
     }
     
   //count who is online
   socket.on('count users',onCount);

   //add file waiting user
   socket.on('wait',onWait);

   //add file chating
    socket.on('chat',onChat);

    //show data 
    socket.on('data',onData)

    //if chater found you he will give you know about that
    socket.on('found user',onFound);
   
    //add mes of intl
    socket.on('get message',htmlMesForm);

    //socket will add data user
    socket.on('data chat',onDataChat);

    //socket stops chat
    socket.on('stoped chating', onStoped);

    //int is typing
    socket.on('typing',onType);

    //int've stoped chat
    socket.on('sound',soundClick);

    //socket delete class read
    socket.on('have read',onReaded);

    socket.on('io',onIo)

    socket.on('disconnect',onDisconnect)

   function onCount(data) {

      let $elem = $('#user_chating>b');

      (data == 1)?$elem.html('1 пользователь '):$elem.html(data+' пользователей ');

   }

   function onWait(data) {

    $('.data-user,.chating').css({'display':'none'});
    $('.wait').css({'display':'block'});
    heightWaiting();
   }

   function onChat(data) {
    let elUserAdded = '<div class="message" id="userFouned"><hr><i>Собеседник найден</i><hr></div>'
    
    $('.wait,.data-user').css({'display':'none'});
    $('.chating,#stop_chat').css({'display':'block'});
    $('.area_of_messages').append(elUserAdded)
    soundClick();
    heightWaiting();
   }

   function onData(data) {

    $('.wait,.chating').css({'display':'none'});
    $('.data-user').css({'display':'block'});
    heightMain();
   }
   function onFound(data) {
     socket.emit('check','');
   }

   function onDataChat(data) {
      $('.wait').css({'display':'none'});
      $('.data-user').css({'display':'block'});

      heightMain(document);
      limit_user();
      set_data_users();

      socket.emit('online','');
   }

   function onStoped(data) {
     $el_but_stop_chat = $('#stop_chat')
     $el      = $('.choice');
     $el_in_t = $('#inner_text_message'); 

     $el.css('display','flex');
     $el_but_stop_chat.css('display','none')
     $el_in_t.prop('contenteditable',false);
     $el_in_t.empty();
      socket.emit('lul stop');
     scrollbar();
   }

   function onType() {

    let $el = $('#typing');
    
    let opacity = $el.css('opacity');

    if(opacity == '0'){

      $el.animate({'opacity':1},2000).animate({'opacity':0},500);

    }
   }

   function onReaded() {
     $el = $('.you.read');

     $el.removeClass('read');
   }

   function onIo(data){
    
    let $io = $('meta[name="io"]')

    $io.attr('content',data)
        
   }

   function onDisconnect(reason){

    //this will show user that someting went wrong
        $('.content').empty()
        bootbox.alert({
          message:'Потеряно соеденение с сервером, попробуйте перезагрузить страницу'
        })
        socket.close()

   }
   function stop_search(){
      socket.emit('stop search',{});
   }


//show form of smiles
function show_emojis(){

  //elem bar
  let $bar_emojs = $('#wrapper_emojis');

   $('#smiles').on('mouseover',
    function(){

      $el = $('#inner_text_message')

      let able = $el.prop('contenteditable')

      if(!able){
        console.log(able)
        return false
      } 
      //heigth of emoj's tab
          let height = $(document).height() / 10 + 'px';
          
          let right  = $('aside').height();
          
          if(right != 1){

            right = $('aside').width() + 5 + 'px';

          }
          else right = 5+'px';

          let width  = $('.content').width() / 3 * 2 + 'px';
          
          $('.slimScrollBar').css({
              backgroundColor:  'grey', 
          });

          let bottom = $('.data_for_message').height()+3+'px'

    $bar_emojs.slimScroll(
      {
        height:           height,
        start:            'top',
        allowPageScroll:  false,
        barClass:         'slimScrollBar',
        color:            'gray', 
      }
      ).parent().css(
            {
              position:   'fixed',
              bottom:     bottom,
              right:      right,
              width:      width,
              display:    'block',
            }
            ).end().css({
              display: 'block',
            });
  }
  );
  $bar_emojs.on('mouseleave',
    function(){
      $(this).parent().css({
        display: 'none',
      });

      $(this).slimScroll({
        scrollTo: '0px',
      }).css({
        display: 'none',
      });
  }
  );
}
//add chat
 function add_chating_file(data){

    
    show_emojis();
    add_emojis();
    send_message();
    send_media();
    //scrollbar();
    add_messages();
}
$(document).ready(dataem);
//function collect &:cod emojis
function dataem(){
  let naneem = [];
  let tag = [];
  $('#wrapper_emojis img').each(
    function() {
        naneem.push($(this).attr('data-emojis'));
        tag.push($(this).get(0).outerHTML);
    }
  );
   return [naneem,tag];
}
//add emojis to text
function add_emojis(){
  $('#inner_emojis img').click(
      function () {
        let el_mes = "#inner_text_message"

        let able = $(el_mes).prop('contenteditable')

        if(able == 'false') return false

        $(this).clone().appendTo("#inner_text_message");
      }
    );
}
//send data for message to bd
function send_message() {

  let el = '#inner_text_message'

  $(el).on('keyup',(e)=>{

    let able = $(el).prop('contenteditable')

     if(e.which == 13 && able){

        mes_socket($(el));

        $(el).empty();
    
    }
     
  }
    );
  $('#send_message').on('click',()=>{
    let $el = $(el)

    let able = $el.prop('contenteditable')

    if(!able) return false

        mes_socket($el)
      
        $el.empty()
    }
  );
        
}
//ajax form for sending file to php
function mes_socket(str) {

    let $inner = str.html();

    let arrays = dataem();

    let cod_em = arrays[0];

    let tag    = arrays[1];

    let need   = str_replace(tag,cod_em,$inner);
    
    let $text  = $('#send_text_message');
    
    $text.html(need);
    
    let data   = escapeHTML($text.text().trim());

    if(data == '') return;

    socket.emit('message',data);
    

    let date   = new Date();

    let mins   = addZero(date.getMinutes()); 
    let hours  = addZero(date.getHours());
    let time   = hours+':'+mins;

    let obj = {

        time:   time,      
        type:   'string',//this need because user can also send other datas bisides of string from this chanel
        mes:    data,

      };

    htmlMesForm(obj,' you read');
    str.empty();
  }

  function escapeHTML (unsafe_str) {
    return unsafe_str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;'); // '&apos;' is not valid HTML 4
}
function str_replace(search, replace, string)
{
  // 1. все должно быть массивами
  search = [].concat(search);
  replace = [].concat(replace);
 
  // 2. выровнять массивы
  var len = replace.length - search.length;
 
  var p_last = search[search.length - 1];
 
  // 2.1. если массив строк поиска короче
  for (var i = 0; i < len; i++) {
    search.push(p_last);
  }
 
  // 2.2. если массив строк замены короче
  for (var i = 0; i < -len; i++) {
    replace.push('');
  }
 
  // 3. непосредственная замена
  var result = string;
  for (var i = 0; i < search.length; i++) {
    result = result.split(search[i]).join(replace[i]);
  }
  return result;
};
//send file to the server$
$(document).ready(send_media());
  function  send_media(){  
    $('#add').click(
      function(){
        let el = $('#inner_text_message')

        let able = el.prop('contenteditable')
        
        if(able == 'false') return false

          let bottom = $('.data_for_message').height()+3+'px'

        $('.file-upload').fadeIn(500).css('bottom',bottom);
        $('#add_photo_to_server').click(
            function(){
              $('.file-upload').fadeOut(500);
            }
          );
        send_photo();
    } 
  );
 }   
function send_photo(){
  
      let files; // переменная. будет содержать данные файлов
      
      // заполняем переменную данными файлов, при изменении значения file поля
      $('input[type=file]').on('change', function(){
        files = this.files;
        send_files(files);
        this.files = '';
      });
      function send_files(files){
      // ничего не делаем если files пустой
        if( typeof files == 'undefined' ) return;

        // создадим данные файлов в подходящем для отправки формате
        let data = new FormData();
        $.each( files, function( key, value ){
          data.append( 'image', value );
        });

        let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        
        let io =  document.querySelector('meta[name="io"]').getAttribute('content') 
        let contenttype = {
          headers:  {
            'content-type': 'multipart/form-data',
            'CSRF-Token': token,
            'io':io,
          }
        }
        // AJAX запрос
        axios.post('/photo/save', data, contenttype)
        .then((res)=>{
          let data = res.data;
  
          if(data == 0) return false
            else if(data == 'err') $('.pop-up-wrapper').popup('Не получилось отправить фото, попробуйте еще раз')
            
          let date   = new Date();

          let mins   = addZero(date.getMinutes()); 
          let hours  = addZero(date.getHours());
          let time   = hours+':'+mins;

          let obj  = {
            type:   'img',
            time:   time,
            mes:    data,//path to file
          }

          htmlMesForm(obj,' you read');
          
          socket.emit('photo',data);
        });
        
       
      }
} 
//insert messages in the area of chat
function  add_messages(data){
  
  if($('.area_of_messages').length > 0 && data != ''){

            
            
            htmlMesForm(data,' not_you read');
            
       }
    

} 

function savePhoto(event){
  event.preventDefault()
  event.stopImmediatePropagation()

  let path = $(this).attr('data-path')

  let params = {
    path: path,
  }
  
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

        
        //ajax request
        $.ajax({
          method:'post',
          url:'/save_to_gallery',
          data:(params),
          headers:{
                'CSRF-Token': token,
                },
          success:(data)=>{
            $('.pop-up-wrapper').popup(data)
          }
        })


}

function getTime(){

      let date   = new Date();

        let mins   = addZero(date.getMinutes()); 
        let hours  = addZero(date.getHours());

        return hours+':'+mins;

    }
//wrap data in the html form
function htmlMesForm(data,who = ' not_you read') {
  
  let time = getTime();
  let type = data.type;
  let mes;
  
  switch(type) {

    case 'string':
    //get arrays of emoj's uniq id and tags
    let arrays = dataem();

    let cod_em = arrays[0];//uniq id

    let tag = arrays[1];//tags

    let text = str_replace(cod_em, tag, data.mes);//return emojs into the string

    mes = '<div class="span">'+text+'</div>';
    break;

    case 'img':
    let path = '/uploads/photo/'+data.mes;
    //shows position of images
    let $button = $('#showHideImage')

    let hasHidden = $button.hasClass('hidden')

    let tempFile = path
    //if image should be hedden we change a real image on white image

    if(hasHidden) tempFile = '/img/white.png'


    mes = '<a href="'+tempFile+'" data-temp="'+path+'" data-lightbox="userphoto"><div class="save_photo" data-path = "'+data.mes+'"title="Сохранить фото.">+</div><img src="'+tempFile+'" data-temp="'+path+'" alt="" class = "img_chats"></a>';
    break;
  }

  let el   = '<div class="message '+who+'"> <div class="time">'+time+'</div> <div class="text_message">'+mes+'</div></div>';

  $('.area_of_messages').append(el);

  set_h_for_cl_message();

  $('.save_photo').last().on('click',savePhoto)
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
$(document).resize(set_h_for_cl_message);
//$(document).ready(function(){setTimeout(set_h_for_cl_message,3000)});
function set_h_for_cl_message(){
  let height_area_scroll = 0;
  $('.text_message').each(
      function() {
        var  $parent = $(this).parents('.message');//item of messages
        var  $height_this  = $(this).find('.span').height();//
        var $img = $parent.find('.img_chats');
        if($img.length > 0){
          $img.imagesLoaded(
            function(){
              $img.parents('.text_message').css('max-width','40%');
              height_area_scroll += $img.height()+17;
              var h_img  = $img.height()+17+'px';
              $parent.css('min-height',h_img);
            }
          );
        }
        else {
          height_area_scroll += $height_this+10;
        var h = $height_this+8+'px';
          $parent.css('min-height',h);
        }
      }
    );

  //coutn how much aren't read mes
  var lengthmes = $('.not_you.read').length;
  $title = $('title');
  if(lengthmes > 0 ){
    $title.text('+'+lengthmes+' cмс');
  }
  else $title.text('Чат'); 
  //make scroll when imgs was loaded
    $('.img_chats').imagesLoaded(function(){
       $('.area_of_messages').scrollTop(height_area_scroll);
 }
 );
    scrollbar();
}
//this coocky show that pages is reloaded
$(document).ready(
  function() {coockyreload();
  }
);
function coockyreload(){
  if($('.area_of_messages').length > 0){
      Cookies.set('reload', 'reloaded');
  }
  }
  //else one function for reloaded
  $(document).ready(
    function(){
      var message = localStorage.getItem('data_chat');

        $('.area_of_messages').html(message);

    }
    );
  
  
      //scroll bar
      
      function scrollbar(){
        $(document).ready(function(){

        let choice = $('.choice');
        let chating = $('.chating').height();

        let begin = $('#begin_2').height();

        let info = $('.data_for_message').height();

       
        let choice_height = choice.height();

        let choice_dis = choice.css('display');

        if(choice_dis == 'none') choice_height = 0;

        let area = chating-begin-info-choice_height;
        
         console.log('data',typeof begin)

        $('.area_of_messages').slimscroll(
          {
      
            color:    'gray',
            start:    'bottom',
            height:   area+'px', 
            barClass: 'chatScroll',

          }
          );
        })

      }
      

      //function for stop searching
  
  //add galary
      lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'alwaysShowNavOnTouchDevices':true
    });
      //add dialog to auth user
     
    

       function stop_chat() {
          bootbox.confirm({
            message:'<div>Вы уверены что хотите закончить чат?</div>',
            buttons:{
              confirm:{
                label:'Да',
                className: 'btn-success',
              },
              cancel:{
                label:'Нет',
                className: 'btn-danger'
              }
            },
            local:'ru',
            closeButton:false,
            callback: function(result) {
              if(result){
                socket.emit('stop chat',{});
              }
            }
          });
       }

       function begin_new_chat(){

          let obj = Cookies.get( 'data_user');
          let $el  = $('.area_of_messages');

          if(obj == undefined)  return false;

          obj = JSON.parse(obj);
          
          socket.emit('search',obj);

          $el.empty();

          $('#inner_text_message').prop('contenteditable',true);
          $('.choice').css('display','none');

       }

       function change_the_data() {
          let $el  = $('.area_of_messages');

          socket.emit('change data',{});

          $el.empty();

          $('#inner_text_message').prop('contenteditable',true);
          $('.choice').css('display','none');

       }

       function typing() {
        //this function will send intelocutor that user is typing message
        $el_read      = $('.not_you.read');
        let $el_t     = $('title');

        socket.emit('input',{});
        socket.emit('read',{});

        $el_read.removeClass('read');

        $el_t.text('Чат');
       }

       function soundClick() {
          let audio = new Audio(); // Создаём новый элемент Audio
          audio.src = '/audio/click.mp3'; // Указываем путь к звуку "клика"
          audio.autoplay = true; // Автоматически запускаем
      }
      //this function will show int you read a mess
      function read() {
        let $el_read  = $('.not_you.read');
        let $el_t     = $('title');

        
        socket.emit('read',{});
        
        $el_read.removeClass('read');

        $el_t.text('Чат');

      }
      //this function will let user hide or show images in the chat

      function showHideImage(){
        
        let $button = $('#showHideImage')

        $button.toggleClass('hidden')

        let hasHidden = $button.hasClass('hidden')

        let $images = $('.img_chats')

        $images.each(function() {
          let path =  $(this).attr('src')
          let a    =  $(this).parent('a')
          
          if(!hasHidden){
            //show image
            let temp = $(this).attr('data-temp')
            $(this).attr('src',temp)
            
            //show light box
            let tempA = a.attr('data-temp')
            a.attr('href',tempA)

          }
          else{
            //hide image
            $(this).attr('data-temp',path)

            $(this).attr('src','/img/white.png')
            //hide light box
            a.attr('data-temp',path)

            let white = '/img/white.png'
            a.attr('src',white).attr('href',white)

          }
        })

      }