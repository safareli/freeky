const daggy = require('daggy')
const Task = require('data.task')
const {Free, liftF} = require('./free')
const {Either, Left, Right} = require('./either')
const {Maybe, Just, Nothing} = require('./maybe')
const {State, getState, putState, modifyState} = require('./state')
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

const gtZero = x =>
  (x > 0) ? Right(x) : Left("it was less than zero")

const asyncGet = n =>
  Cont((rej, res) => setTimeout(() => res(n), 400))

const app = (x, y) =>
  Monad.do(function *() {
    const eitherNumber = gtZero(x).fold(e => 10, id)
    const asyncNumber = yield asyncGet(y)
    return Monad.of(eitherNumber + asyncNumber)
  })

const runApp = dispatch([[ContM, contToTask], [Either, eitherToTask]])

app(0, 4).foldMap(runApp, Task.of).fork(console.error, console.log)

// state
// fold free
