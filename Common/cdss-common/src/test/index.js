
var test = require('unit.js');
var cdss = require('../../dist/main.js');


// console.log(global.cdss);


test.number(global.cdss.test1()).is(1);
