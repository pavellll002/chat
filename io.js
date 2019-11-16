const Chaters 		=		require('./mongoose').chaters;
const Crud 			= 		require('./crud');
const Cd 			= 		require('./checkdata');
const Fs 			= 		require('fs');


module.exports.io = function (io,Sp,protectOpts) {

	io.on('connection',onConnect);

let cleanTempFiles = (person,socketId)=>{
	console.log(person)
	if(	!person.chat_io	||	!person.img_path) return false
	let chat_io = person.chat_io
	let imgPath = person.img_path

	if(imgPath.length == 0) return false
	//delete temp photos
						Chaters.findOne({
							io:chat_io,
						},
						(err,doc)=>{

							if(err) console.log(err)

								if((doc != null && doc.chat_io != socketId) || (doc != null && (doc.pos == 1 || doc.pos == 0))){
								
									let arrImg = imgPath

									//if file is not empty  continue
									if(arrImg.length == 0) return false

									for(let name of arrImg){

										let path  = './static/uploads/photo/'+name
										//delete file
										Fs.unlink(path,(err)=>{
											console.log(err)
										})

									}

									Chaters.updateOne({io:socketId},{img_path:[]},(err)=>{if(err)console.log(err)})
									Chaters.updateOne({io:doc.io},{img_path:[]},(err)=>{if(err)console.log(err)})
								}
								else if(doc == null){

									let arrImg = imgPath

									for(let name of arrImg){

										let path  = './static/uploads/photo/'+name
										//delete file
										Fs.unlink(path,(err)=>{
											console.log(err)
										})

									}
									Chaters.updateOne({io:socketId},{img_path:[]},(err)=>{if(err)console.log(err)})
								}
						})

}
function onConnect(socket) { 
		

		socket.emit('io',socket.id)

		
  Sp.protectConnect(socket, protectOpts); 
		let chat_id = '';
		//add cheter's io to the db
		let chater = new Chaters({io:socket.id});
		chater.save(Crud.save);

		//this function will update chater's io and try to find intelocutor
		socket.on('search',function (data) {
			
			//this thing check data for correctly
			if(Cd.check_data(data)){

				//all data what I'll use in search of chat
				let id 		= socket.id;
				let ages 	= data.ages;
				let you 	= data.sex.you;
				let intel 	= data.sex.intelocutor;


				Chaters.findOneAndUpdate(
					{
						io: 	id,
						$or: [ { pos: 0 }, { pos: 3 } ], 	
					},

					{

					pos: 	1,
					you: 	you,
					intel: 	intel,
					ages: 	ages,

					}, 
					
					(err,doc)=> {
						cleanTempFiles(doc,socket.id)
						//here we try to find a intelocutor
						Chaters.findOneAndUpdate(
							{

								io: 		{$ne:id},
								you: 		{$in:intel},
								$or: 		[{'intel.0':you},{'intel.1':you},{'ages.0':ages[1]},{'ages.0':ages[2]}],
								'ages.1': 	{$lte:ages[0]},
								'ages.2': 	{$gte:ages[0]}, 	
								pos: 		1,

							},

							{
								chat_io: 	id,
								pos: 		2,//user is chating
							},

							{
								new:true,
							},

							function(err,doc) {
								if(err) return console.log(err);

								//if doc isn't null we will update the user which pos will be 2
								if(doc != null) {

								chat_id = doc.io;

								let chat_io = doc.io;

								Chaters.updateOne(
								{

									io: 		id,
									pos: 		1,//user is in a search of chater

								},
								{
								
									pos: 		2,//user is chating
									chat_io: 	chat_io,	
							
								},

								function(err,doc) {

									if(err) return console.log(err);

										//if chater was updated we send the intelocutor that he founded
									if(doc.nModified == 1) {

										//tell user that chater was ounded
										io.to(chat_io).emit('found user','found');

										//add file chating
										socket.emit('chat',{});

									}
									//if chater wasn't updated we change a intelocutor's pos on 1
									else if( doc.nModified == 0 ) {
										//if chater wasn't update we delete chat io id
										chat_id  = '';

										Chaters.updateOne(
										{

											io: 		chat_io,

										},

										{

											pos: 		1,
											chat_io: 	'', 

										},
										Crud.save
										);

									}

							}
							);
						}

						else if( doc == null ) {

							socket.emit('wait',{});

						}

					}

					);

					}
				);

				}
			

		});
		

		//this socket will check that user was founded
		socket.on('check',onCheck);

		//socket send message to user
		socket.on('message',onMessage);

		//get photo for intelocutor
		socket.on('photo',onPhoto);

		//stop searching 
		socket.on('stop search',onStopSearch);

		//
		socket.on('online',onOnline);

		socket.on('stop chat',onStopChat);

		socket.on('change data',onChange);

		//this function will show intl you type a mes
		socket.on('input',onInput);

		//user've read a mess
		socket.on('read',onRead);

		//socket doesn't let user send a mess
		socket.on('lul stop',onLul);


		socket.on('disconnect',()=>{
			//this show how many users are online
			io.emit('count users',io.server.engine.clientsCount)
			//clean temp files
			Chaters.findOne({
				io:socket.id,
			},
			(err,doc)=>{
				if(err) console.log(err)
					cleanTempFiles(doc,socket.id)
			})
			//del chater from db
			Chaters.deleteOne({io:socket.id},Crud.del);

			Chaters.updateOne({io:chat_id,pos:2,},{pos:3},(err,doc)=>{

							if(err) return console.log(err);

							io.to(chat_id).emit('stoped chating', {});
							io.to(chat_id).emit('sound', {});
							
							chat_id = '';
						});

		});

		//functions on
		function onCheck(data) {
			Chaters.findOne(
				{

					io: 	socket.id,
					pos: 	2,//user is chating

				},
				function(err,doc){

					if(doc != null){
						//set chater id
						chat_id = doc.chat_io;

						socket.emit('chat',{});
					}

			}
			);
		}

		function onMessage(data) {

			//remove html from string
			let str = Cd.escapeHTML(data.trim());

			let obj = {

				type: 	'string',//this need because user can also send other datas bisides of string from this chanel
				mes: 	str,

			};

			if(typeof str === 'string' && chat_id != '' && str != ''){

				//send a string intelocutor
				io.to(chat_id).emit('get message', obj);

			}

		}

		function onPhoto(data){

			let path_to_file 	= './static/uploads/photo/'+data;

						
			let str = Cd.escapeHTML(data.trim());

			let obj = {
				type: 	'img',
				mes: 	str,
			}
			
			if(Fs.existsSync(path_to_file)){

				if(typeof str === 'string' && chat_id != '' && str != ''){

					//send a string intelocutor
					io.to(chat_id).emit('get message', obj);

				}
			
			}
		}

		function onStopSearch(data) {
			Chaters.updateOne(
				{
					io: 	socket.id,
					pos: 	1,
				},
				{
					pos: 	0,
				},
				(err,doc)=>{

					if(err) return console.log(err);
					
					if(doc.nModified == 1) {

						socket.emit('data chat', {});
					}
				}
				);
		}

		function onOnline(data) {
			socket.emit('count users',io.server.engine.clientsCount);
		}

		function onStopChat(data){

			Chaters.updateOne(
				{

					io:socket.id,
					pos: 	2,
				},
				{
					pos: 	3,
				},
				(err,doc)=>{

					if(err) return console.log(err);

					if(doc.nModified == 1) {
						let cid = chat_id; 

						Chaters.findOneAndUpdate({io:cid,pos:2,},{pos:3},(err,doc)=>{

							if(err) return console.log(err);

							
							io.to(cid).emit('stoped chating', {});
							io.to(cid).emit('sound', {});
							
							cid = '';
						});

						socket.emit('stoped chating', {});
						chat_id = '';

					}
				}
				);
		}
		
		function onChange(data){
			Chaters.findOneAndUpdate(
				{

					io: 	socket.id,
					pos: 	3,
				},
				{
					pos: 	0,
				},
				(err,doc)=>{

					if(err) console.log(err)
					cleanTempFiles(doc,socket.id)

					if(doc != null) {

						socket.emit('data', {});
						
					}
				}
				);
		}

		function onInput() {
			if(chat_id != '') io.to(chat_id).emit('typing');
		}

		function onRead() {
			// body...
			io.to(chat_id).emit('have read',{})
		}
		function onLul(){
			chat_id = '';
		}
		//this show how many users are online
		io.emit('count users',io.server.engine.clientsCount);
}


}
