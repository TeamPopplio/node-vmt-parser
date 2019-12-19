const vmt = require('./VMTConvert');

var data = vmt.parseVMT("astr_holo.vmt").then((content) => {
    console.log(content);
});

var data = vmt.parseVMT("astr_gold.vmt").then((content) => {
    console.log(content);
});