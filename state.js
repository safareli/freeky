const daggy = require('daggy')
const {liftF} = require('./free')

const StateM = daggy.taggedSum({State: ['run']})
const State = StateM.State

StateM.get = liftF(State(s => [s,s]))
StateM.put = s => liftF(State(_ => [null,s]))

StateM.modify = f => State.get.chain(x => State.put(f(x)))

StateM.of = a => State(b => [a, b]);
State.prototype.chain = function(f) {
  return State(s => {
    const [a,b] = this.run(s);
    return f(a).run(b);
  });
};


module.exports = StateM

