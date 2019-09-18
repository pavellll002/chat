//crud
let all = function (err,doc){
		if(err) return console.log(err);
		console.log(doc);
	};
	
module.exports = {
	del:all,
	save:all
};

