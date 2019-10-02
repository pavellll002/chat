function check_data(data) {

	let your_sex = data.sex.you;
	let intelocutor_sex = data.sex.intelocutor;
	let ages = data.ages;
	let agree = data.agree

	if(check_you(your_sex) && check_int(intelocutor_sex) && ckeck_ages(ages) && check_agree(agree)) return true;
	else return false;
};

function check_int(ints) {
	// check correct data of intelucutor

	let length = ints.length;

	if(length <= 2 && length > 0){

		for(let int of ints){

			if(int < 0 && int > 1 ) return false;
		
		}
		return true;
	}

	else return false; 
}

function check_you(ys) {
	// check your data for correctly
	if(ys == 0 || ys == 1) return true; else return false;	
}

function ckeck_ages(as) {
//check for correctly data of sent ages
	let length = as.length;

	if(length == 3){

		for(let a of as){
			if(a < 14 || a > 99)	return false;
		}
		if(as[1] < as[2])return true; else return false;

	}
	else return false;
}
function check_agree(agree){
	if(agree == true) return true
		else false
}
function escapeHTML (unsafe_str){
    return unsafe_str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;'); // '&apos;' is not valid HTML 4
}

function addZero(i){
	if (i < 10) {

		i = "0" + i;
	}

		return i;
}

module.exports = {
	check_data: check_data,
	escapeHTML: escapeHTML,
};