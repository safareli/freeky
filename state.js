const daggy = require('daggy')
const {liftF} = require('./free')

const State = daggy.tagged('run')

State.get = liftF(State(s => [s,s]))
State.put = s => liftF(State(_ => [null,s]))

State.modify = f => State.get.chain(x => State.put(f(x)))

State.of = a => State(b => [a, b]);
State.prototype.chain = function(f) {
  return State(s => {
    const [a,b] = this.run(s);
    return f(a).run(b);
  });
};


module.exports = State
