let authorized = false

function checkAuth(req, res, next) {
  if (authorized) {
    next()
  } else {
    res.status(403).send('Unauthorized!')
    return
  }
}

module.exports = checkAuth