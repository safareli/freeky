const daggy = require('daggy')
const Task = require('data.task')
const {Free, liftF} = require('./free')
const {Either, Left, Right} = require('./either')
const {Maybe, Just, Nothing} = require('./maybe')
const State = require('./state')
const {dispatch} = require('./interpret')

const id = a => a
const compose = (f, g) => x => f(g(x))

const Monad = {
  do: gen => {
    const g = gen()
    const step = value => {
      const result = g.next(value)
      return result.done ?
            result.value :
            result.value.chain(step)
    }
    return step()
  },
  of: Free.of
}


const IOM = daggy.taggedSum({IO_: ['f']})
const IO = compose(liftF, IOM.IO_)

const ContM = daggy.taggedSum({Cont_: ['t']})
const Cont = f => liftF(ContM.Cont_((new Task(f))))

const maybeToTask = m => m.fold(Task.of, Task.rejected)
const contToTask = c => c.t
const eitherToTask = m => m.fold(Task.rejected, Task.of)
const ioToTask = i => new Task((rej, res) => res(i.f()))


//const mres = Monad.do(function *() {
//  const four = yield Just(2)
//  //const two = yield Just(3)
//  const two = yield Nothing
//  return Monad.of(four + two)
//})

//mres.foldMap(maybeToTask, Task.of).fork(console.error, console.log)
//
//runFState :: FState s a -> s -> (a,s)
//runFState (Pure x) s   = (x,s)
//runFState (Impure m) s = let (m',s') = unState m s in runFState m' s'
//const stateToState = id
  // State.of(
// }
//

const stateToTask = m => {
  return new Task((rej, res) => {
    this.fork(e => e, a => m.run(a))
  })
}

const eitherToState = m => m.fold(State.of, State.of)

const gtZero = x =>
  (x > 0) ? Right(x) : Left("it was less than zero")

const asyncGet = n =>
  Cont((rej, res) => setTimeout(() => res(n), 400))

const app = x =>
  Monad.do(function *() {
    const y = yield State.get
    const eitherNumber = gtZero(x).fold(e => 10, id)
    console.log("Y", y)
    return Monad.of(eitherNumber + y)
  })

//const runApp = dispatch([[ContM, contToTask], [Either, eitherToTask]])
//const runApp = dispatch([[State, id], [Either, eitherToState]])
const runApp = dispatch([[State, stateToTask], [Either, eitherToTask]])

app(0).foldMap(runApp, Task.of).fork(console.error, s => console.log(s))

// state
// taggedSum => tagged
