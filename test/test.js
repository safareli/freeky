const Identity = require('fantasy-identities')
const test = require('tape');

const {Free, liftF} = require('../free.js')
const Monad = require('../monad.js')

test('Monad.do', t => {
  const tree = Monad.do(function*(){
    const a = yield liftF(1)
    const b = yield liftF(2)
    return Monad.of([a, b])
  })
  t.deepEqual(
    [
      tree.foldMap((a) => Identity(a), Identity),
      tree.foldMap((a) => Identity(a), Identity),
    ],
    [
      Identity([1,2]),
      Identity([1,2])
    ],
    'result of Monad.do should be reusable'
  )
  t.end()
})
