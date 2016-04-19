const daggy = require('daggy')
const liftF = require('./free').liftF

const State = daggy.tagged('run')

State.get = liftF(State(s => [s,s]))
State.put = s => liftF(State(_ => [null,s]))

State.modify = f => State.get.chain(x => State.put(f(x)))

State.of = a => State(b => [a, b]);
State.prototype.chain = function(f) {
  return State(s => {
    const xs = this.run(s);
    return f(xs[0]).run(xs[1]);
  });
};


module.exports = State
