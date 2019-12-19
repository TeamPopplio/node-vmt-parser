const vmt = require('./VMTConvert');

vmt.parseVMT("basilisk.vmt").then((content) => {
    console.log(content);
});
vmt.parseVMT("astr_holo.vmt").then((content) => {
    console.log(content);
});