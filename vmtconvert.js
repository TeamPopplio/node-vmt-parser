const fs = require('fs');

function isNullOrEmpty(value) {
	return !(typeof value === "string" && value.length > 0);
}

function isRelevantLine(value) {
	value = removeLeadingCharsUntil("$", value);
	return (!isNullOrEmpty(value) && value.startsWith("$"));
}

function removeLeadingCharsUntil(allowed_char, data_string) {
	while(data_string.length > 0 && data_string[0] != allowed_char) data_string = data_string.substr(1);
	return data_string;
}

function removeTrailingCharsAfter(seperator, data_string) {
	if(data_string.length > 0 && data_string.indexOf(seperator) >= 0) data_string = data_string.substr(0, data_string.indexOf(seperator));
	return data_string;
}

function isFloat(n) {
    return parseFloat(n) == n 
}

function isInteger(n) {
	return parseInt(n) == n 
};

class VMTConvert {
	//https://developer.valvesoftware.com/wiki/Category:List_of_Shader_Parameters
	//TODO: Multidimensional?
	static parseVMT(vmtFile){
		return new Promise((resolve, reject) => {
			try {
				let contents = fs.readFileSync(vmtFile, 'utf8');
				let retArr={};
				if(contents == null || contents == undefined){ 
					resolve(retArr);
					return;
				}
				let lines = contents.replace(/\t/g, " ").replace(/\r/g, "").split("\n").filter(line => isRelevantLine(line.trim()));
				for(let line of lines) {
					line = removeLeadingCharsUntil("$", line);
					line = line.replace(/\"\"/g, "  ").replace(/\"/g, " ").toLowerCase();
					let startKey = line.indexOf("$");
					line = line.substring(startKey, line.length);
					let endKeySpace_Tab = line.indexOf(" ", startKey);
					let key = line.substring(startKey-1, endKeySpace_Tab).replace("$", "");
					let value = removeTrailingCharsAfter("//", line.replace(" ", "").replace("$", "").replace("\"", "").replace(key, "").replace(/\r/g, "").replace(" ", "").trim());					
					if(value.includes("[") && value.includes("]")){//Its a Array!
						let tArr = value.replace("[", "").replace("]", "").split(" ").filter(e => !isNullOrEmpty(e));
						for (let a = 0; a < tArr.length; a++) {
							let val = tArr[a];
							if(!isNaN(val)) tArr[a] = parseInt(val);//Its a Integer!
							if(val.startsWith(".")) tArr[a] = parseFloat("0"+val);//Its a Float!
						}
						retArr[key] = tArr;
					} else if(isFloat(value)){//Its a Decimal! (Float)
						if(value.startsWith(".")) value = "0"+value;
						retArr[key] = parseFloat(value);
					} else if(isInteger(value)){//Its a Integer!
						retArr[key] = parseInt(value);
					} else {//Its a String or something unsupported..
						value = value.toString();
						value = value.replace(/\"/g, "");
						value = value.replace(/\\/g, "/");
						retArr[key] = value.toLowerCase();
					}
				}
				resolve(retArr);
			} catch (err) {
			  reject(err);
			}
		});
	}
}
module.exports = VMTConvert;