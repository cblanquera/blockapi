const { parse } = require('url')

module.exports = (req, res) => {
  const { host, pathname, query } = parse(req.url, true);
  res.end(host + ' -- ' + pathname);
}
