const daggy = require('daggy')
const Task = require('data.task')
const {liftF} = require('./free')
const ContType = daggy.tagged('t')
const Cont = f => liftF(ContType((new Task(f))))

module.exports = {ContType, Cont}
