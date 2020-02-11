var express = require('express')
var app = express()
var bodyParser = require('body-parser')

var mysql = require('mysql')
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3305,
	user: 'cam',
	password: 'camrulez',
	database: 'books'
})
connection.connect()


var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('assets'))

app.get('/', function(req, res) {
	res.send('Hello, there.')
})

app.get('/cam', function(req, res) {
	res.send('Hello, cam.')
})

app.get('/books', function(req, res){
	connection.query('SELECT * FROM test', function(error, results, fields){
		if (error) throw error
		console.log('The response is: ', results)
		res.send(JSON.stringify(results))
	})
})

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function(req, res) {
	response = {
		first_name: req.query.first_name, 
		last_name: req.query.last_name
	}

	console.log(response)
	res.end(JSON.stringify(response))
})

app.post('/add_book', urlencodedParser, function(req, res) {
	response = {
		title: req.body.title, 
		author: req.body.author,
		published: req.body.published,
		done: req.body.done ? 1 : 0
	}
	connection.query('INSERT into test values(?, ?, ?, ?)', [response.title, response.author, response.published, response.done], function(error, results, fields) {
		if (error) throw error;
		console.log("Sucessfully added book %s", response.title)
	})
	res.send(JSON.stringify(response))
})


var server = app.listen(8081, '127.0.0.1', function() {
	var host = server.address().address
	var port = server.address().port
	
	console.log("Example app listening at http://%s:%s", host, port)
})
