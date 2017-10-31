var fs = require('fs');
var config = require('../config');
const { Console } = require('console');

const output = fs.createWriteStream(config.log_info);
const errorOutput = fs.createWriteStream(config.log_error);

module.exports = new Console(output, errorOutput);