const id = x => x

const find = (xs, f) => {
  var found;
  for(x in xs) {
    if(f(xs[x])) {
      found = xs[x]
      break;
    }
  }
  return found;
}

const dispatch = pairs =>
  instruction_of_arg => {
    const interpreter = find(pairs, ([type, inter]) =>
        instruction_of_arg.constructor === type)[1]

    return interpreter(instruction_of_arg)
  }


module.exports = { dispatch }
