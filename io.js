const daggy = require('daggy')
const {liftF} = require('./free')

const IOType = daggy.tagged('f')
const IO = f => liftF(IOType(f))

module.exports = {IOType, IO}
