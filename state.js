const daggy = require('daggy')
const {liftF} = require('./free')

const State = daggy.taggedSum({Get: [], Put: ['f']})
const {Get, Put} = State

const getState = liftF(Get)
const putState = x => liftF(Put(x))
const modifyState = f => getState.chain(x => putState(f(x)))

State.of = a => getState.map(b => a)

const unState = (m, s) =>
  m.cata({
    Get: () => [s, s],
    Put: z => [null, z]
  })

const runState = (free, s) =>
  free.cata({
    Pure: x => [x, s],
    Impure: (m, q) => {
      const [x, z] = unState(m, s)
      return runState(q(x), z)
    }
  })

module.exports = { State, runState, getState, putState, modifyState }


