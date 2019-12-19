const fs = require('fs');

function isNullOrEmpty(value) {
	return !(typeof value === "string" && value.length > 0);
}

function isRelevantLine(value) {
	return (!isNullOrEmpty(value) && value.startsWith("$"));
}

class VMTConvert {
	//https://developer.valvesoftware.com/wiki/Category:List_of_Shader_Parameters
	//TODO: Multidimensional?
	static parseVMT(vmtFile){
		return new Promise((resolve, reject) => {
			fs.stat(vmtFile, function(err, stat) {
				if(err == null) {
					fs.readFile(vmtFile, 'utf8', function(err, contents) {
						if(contents == null || contents == undefined) resolve(null);
						let retArr={};
						let lines = contents.replace(/\t/g, "").split("\r\n").filter(line => isRelevantLine(line));
						for(let line of lines) {
							let key = line.substring(line.lastIndexOf("$") + 1, line.indexOf(" "));
							let value = line.replace(" ", "").replace("$", "").replace(key, "");
							if(value.includes("\"[") && value.includes("]\"")){//Its a Array!
								let tArr = value.replace("\"[", "").replace("]\"", "").split(" ").filter(e => !isNullOrEmpty(e));
								for (let a = 0; a < tArr.length; a++) {
									let val = tArr[a];
									if(!isNaN(val)) tArr[a] = parseInt(val);//Its a Integer!
									if(val.startsWith(".")) tArr[a] = parseFloat("0"+val);//Its a Float!
								}
								retArr[key] = tArr;
							} else if(value.includes(".")){//Its a Decimal! (Float)
								if(value.startsWith(".")) value = "0"+val;
								retArr[key] = parseFloat(value);
							} else if(!isNaN(value)){//Its a Integer!
								retArr[key] = parseInt(value);
							} else {//Its a String or something unsupported..
								value = value.replace(/\"/g, "");
								value = value.replace(/\\/g, "/");
								retArr[key] = value;
							}
						}
						resolve(retArr);
					});
				} else if(err.code == 'ENOENT') {
					resolve(null);
				} 
			});
		});
	}
}
module.exports = VMTConvert;