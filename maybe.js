const daggy = require('daggy')
const {liftF} = require('./free')

const Maybe = daggy.taggedSum({ Just_: ['x'], Nothing_: [] })
const {Just_, Nothing_} = Maybe

const Just = x => liftF(Just_(x))
const Nothing = liftF(Nothing_)

Maybe.of = Just

Maybe.prototype.fold = function(f, g) {
  return this.cata({ Just_: f, Nothing_: g })
}

module.exports = {Maybe, Just, Nothing}
