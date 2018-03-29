const path = require('path');
const fs = require('fs');
const solc = require('solc');

const pathToFile = path.resolve(__dirname, 'contracts', 'LotteryContract.sol');
const source = fs.readFileSync(pathToFile, 'utf8');

module.exports = solc.compile(source, 1).contracts[':LotteryContract'];
