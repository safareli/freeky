const Free = require('./free').Free

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

module.exports = Monad
