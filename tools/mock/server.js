let  handleCgid= require('./data.js')
let  handleSmsid= require('./dataSms.js')
const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
// Add custom routes before JSON Server router
server.post('/cgi-bin/cgi_huayi.cgi', (req, res) => {
    //req.params, req.query ,req.body
    res.send(handleCgid(req.body))
})
server.post('/cgi-bin/cgi_modem.cgi', (req, res) => {
    //req.params, req.query ,req.body
    res.send(handleSmsid(req.body))
})

server.listen(6828, () => {
  console.log('JSON Server is running')
})