const daggy = require('daggy')
const liftF = require('./free').liftF

const Either = daggy.taggedSum({ Left_: ['x'], Right_: ['x'] })

const Left = x => liftF(Either.Left_(x))
const Right = x => liftF(Either.Right_(x))

Either.of = Right

Either.prototype.fold = function(f, g) {
  return this.cata({ Left_: f, Right_: g })
}

module.exports = {Either, Left, Right}
