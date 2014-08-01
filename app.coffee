require 'coffee-script'

express  = require('express')
http     = require('http')
app = express()


app.set 'port', process.env.PORT || 7004

app.get '/*', (req, res) ->
  res.sendfile "#{__dirname}/www/index.html"

server = app.listen(7004)