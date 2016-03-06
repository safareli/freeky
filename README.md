# Collection of Free monads

## Synopsis

```js

// either Example
const gtZero = x =>
  (x > 0) ? Right(x) : Left("it was less than zero")

// cont example (cont just wraps task. prob a misnomer)
const asyncGet = n =>
  Cont((rej, res) => setTimeout(() => res(n), 100))

// do syntax works for any 1 monad. Since it's all in Free, we can use multiple
const app = Monad.do(function *() {
  const ioNumber = yield IO(() => 1)
  const maybeNumber = yield Just(2)
  const contNumber = yield asyncGet(3)
  const eitherNumber = yield gtZero(4)
  return Monad.of(ioNumber + maybeNumber + eitherNumber + contNumber)
})

// some nt's to Task
const maybeToTask = m => m.fold(Task.of, Task.rejected)
const contToTask = c => c.t
const eitherToTask = m => m.fold(Task.rejected, Task.of)
const ioToTask = i => new Task((rej, res) => res(i.f()))

// this tells our Free.foldMap how to dispatch. We need all of them to turn into a target monad (in this case Task)
const runApp = dispatch([ [IOType, ioToTask],
                          [ContType, contToTask],
                          [Either, eitherToTask],
                          [Maybe, maybeToTask]
                        ])

app.foldMap(runApp, Task.of).fork(console.error, console.log)
```

Run with `node --harmony_destructuring example.js`
