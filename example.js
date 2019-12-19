const vmt = require('./VMTConvert');

var data = vmt.parseVMT("cs20_2old_glossy.vmt").then((content) => {
    console.log(content);
});

var data = vmt.parseVMT("astr_gold.vmt").then((content) => {
    console.log(content);
});