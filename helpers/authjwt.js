const jwt = require("express-jwt");

function authjwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/brands(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/colors(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/sizes(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/types(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/sales(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/saleItems(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/users(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/register`,
      `${api}/users/login`,
    ],
  });
}

module.exports = authjwt;

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) done(null, true);
  done();
}
