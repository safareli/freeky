module.exports = {
  IO: require('./io'),
  Either: require('./either'),
  Maybe: require('./maybe'),
  Cont: require('./cont'),
  State: require('./state'),
  dispatch: require('./interpret'),
  Monad: require('./monad'),
  Free: require('./free'),
  liftF: require('./free').liftF
}
