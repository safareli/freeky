const daggy = require('daggy')
const liftF = require('./free').liftF

const Maybe = daggy.taggedSum({ Just_: ['x'], Nothing_: [] })

const Just = x => liftF(Maybe.Just_(x))
const Nothing = liftF(Maybe.Nothing_)

Maybe.of = Just

Maybe.fromNullable = x => x == undefined ? Nothing : Just(x)

Maybe.prototype.fold = function(f, g) {
  return this.cata({ Just_: f, Nothing_: g })
}

module.exports = {Maybe, Just, Nothing}
