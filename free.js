const daggy = require('daggy')

const Free = daggy.taggedSum({Impure: ['x', 'f'], Pure: ['x']})

Free.of = Free.Pure

const kleisli_comp = (f, g) => x => f(x).chain(g)

Free.prototype.fold = function() {
  return this.x.fold.apply(this.x, arguments)
}


Free.prototype.map = function(f) {
  return this.cata({
    Impure: (x, g) => Free.Impure(x, y => g(y).map(f)),
    Pure: x => Free.Pure(f(x))
  })
}

Free.prototype.ap = function(a) {
  return this.cata({
    Impure: (x, g) => Free.Impure(x, y => g(y).ap(a)),
    Pure: f => a.map(f)
  })
}

Free.prototype.chain = function(f) {
  return this.cata({
    Impure: (x, g) => Free.Impure(x, kleisli_comp(g, f)),
    Pure: x => f(x)
  })
}

const liftF = command => Free.Impure(command, Free.Pure)

// Special object which should be ignored.
const IGNORE_VALUE = {}

const fixDo = function(f) {
  return function() {
    const context = this.cata({
      Pure: (a) => this,
      Impure: (intruction_of_arg, next) => {
        if (intruction_of_arg === IGNORE_VALUE) {
          return next()
        } else {
          return this
        }
      }
    })
    return f.apply(context, arguments)
  }
}

Free.prototype.foldMap = fixDo(function(interpreter, of) {
  return this.cata({
    Pure: a => of(a),
    Impure: (intruction_of_arg, next) =>
      interpreter(intruction_of_arg).chain(result =>
        next(result).foldMap(interpreter, of)
      )
  })
})

module.exports = { liftF, Free, IGNORE_VALUE }
