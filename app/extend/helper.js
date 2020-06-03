var dateformat  = require('dateformat')
var path=require('path');
var showdown=require('showdown');

module.exports = {
    //parmas  时间戳          13位的时间戳
    formatTime(parmas){
        return dateformat(new Date(parmas), 'yyyy-mm-dd HH:MM');
    },

    jimpImg200(url){
        let url200 =  url +'_200x200'+ path.extname(url);
        return url200;
    },

    formatMarkdown(str) {
        const converter = new showdown.Converter();
        return converter.makeHtml(str);
    },

}