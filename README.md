# Collection of Free monads

## Install

`npm install freeky`

## Synopsis

Video series on Free Monads here: https://www.youtube.com/watch?v=WH5BrkzGgQY&list=PLK_hdtAJ4KqUWp5LJdLOgkD_8qKW0iAHi&index=1

Walking through our example.js

Run with `node --harmony_destructuring example.js`

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




## Custom Types

You can define your own types in Free and use them as monads.
This is useful if you want to define a composable dsl or multiple interpreters for an action:

```js
const Http = daggy.taggedSum({ Get: ['url'], Post: ['url', 'data'] })
const {Get, Post} = Http

const get = url => liftF(Get(url))
const post = (url, data) => liftF(Post(url, data))

var myFn = get('/home').chain(html => post('save', {markup: html})

const httpToTask = m =>
  m.cata({
    Get: url => new Task((rej, res) => $.getJSON(url).then(res).error(rej),
    Post: (url, data) => new Task((rej, res) => $.post(url, data).then(res).error(rej))
  })

myFn.foldMap(httpToTask, Task.of)
```

or fake it for testing:

```js
const httpToId = m =>
  m.cata({
    Get: url => Id(`getting ${url}`),
    Post: (url, data) => Id(`posting ${url} with ${data}`)
  })

myFn.foldMap(httpToId, Id.of)
```

use it with other monads

```js
const app = Monad.do(function *() {
  const page = yield get('/myUrl')
  const maybeHeader = yield Just($('#header', page))
  return maybeHeader.chain(h => IO(() => console.log(h)))
})

const runApp = dispatch([ [IOType, ioToTask],
                          [Http, httpToTask],
                          [Maybe, maybeToTask]
                        ])

runApp.foldMap(httpToTask, Task.of)
```


