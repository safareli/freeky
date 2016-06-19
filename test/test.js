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


test('mapInstruction', t => {
  const tree = liftF(1).chain(
    a => liftF(2).chain(
      b => Free.of([a,b])
    )
  )

  t.deepEqual(
    tree.mapInstruction((a) => a + 2).foldMap((a) => Identity(a), Identity).x,
    [3,4],
    'should add 2 to all instructions in Free'
  )
  t.end()
})
