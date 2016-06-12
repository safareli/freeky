const { Free, IGNORE_VALUE } = require('./free')

const Monad = {
  do: gen => Free.Impure({ [IGNORE_VALUE]: true}, () => {
    const g = gen()
    const step = value => {
      const result = g.next(value)
      return result.done ?
            result.value :
            result.value.chain(step)
    }
    return step()
  }),
  of: Free.of
}

module.exports = Monad
