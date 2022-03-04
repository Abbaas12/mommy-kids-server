function error_handler(err, req, res, next) {
  return res.send(err);
}

module.exports = error_handler;
