const daggy = require('daggy')
const {liftF} = require('./free')

const Either = daggy.taggedSum({ Left_: ['x'], Right_: ['x'] })
const {Left_, Right_} = Either

const Left = x => liftF(Left_(x))
const Right = x => liftF(Right_(x))

Either.of = Right

Either.prototype.fold = function(f, g) {
  return this.cata({ Left_: f, Right_: g })
}

module.exports = {Either, Left, Right}
