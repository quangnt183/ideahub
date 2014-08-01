require 'coffee-script'

express  = require('express')
http     = require('http')
app = express()

app.configure ->
  app.set 'port', process.env.PORT || 7004
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static "#{__dirname}/www"
  app.use express.logger()

app.get '/*', (req, res) ->
  res.sendfile "#{__dirname}/www/index.html"

server = app.listen(app.settings.port)