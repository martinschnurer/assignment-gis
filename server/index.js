const args = require('get-args')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')
const bodyParser = require('body-parser')
const compress = require('compression')
const schema = require('./schema');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

process.env.NODE_PATH = __dirname

app.use(cors())
app.use(compress())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



app.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json')
	next()
})





app.use('/graphql', bodyParser.json(), graphqlExpress({
  	schema,
}));


app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}))



app.listen(PORT, () => {
	console.log('listening on port ' + PORT + '...')
})