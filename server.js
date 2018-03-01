/**
 * Indra Backend
 * 
 * Mohammed Sohail <sohailsameja@gmail.com>
 * Released under the AGPL-3.0 License
 **/

const io = require("socket.io")(8080);
const util = require("util");
const bodyParser = require("body-parser");
const express = require("express");
const rangi = require("rangi");


const lib = require("./lib/parallelExec");


const app = express();
const serverPort = 3000;

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", client => {
	const clientObject = client.client.request.headers;
	const userAgent = clientObject["user-agent"].split(";").pop().replace(" ", "");
	const ipAddr = clientObject["x-forwarded-for"];

	console.log(rangi.green(`CLIENT CONNECTED => [${ipAddr}]: (${userAgent}`));
	
	client.on("message", msg => {
		lib.execParallel(msg)		
	});

	app.get("/cb", (req, res) => {
		client.emit("receive", req.query.text);

    	res.status(200);

    	console.log(`SENT TO CLIENT => ${rangi.yellow(req.query.text)}`);
	});	
});

app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`);
});