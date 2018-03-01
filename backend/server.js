/**
 * Indra Backend
 * 
 * Mohammed Sohail <sohailsameja@gmail.com>
 * Released under the AGPL-3.0 License
 **/

const io = require("socket.io")(8080);

const lib = require("./lib/parallelExec");

io.on("connection", client => {
	client.on("message", msg => {
		lib.execParallel(msg)
		console.log(msg);
		client.emit("receive", "baapre bap");
	});
});

