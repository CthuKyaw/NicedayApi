require("dotenv").config();
const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const userRouter = require("./api/users/user.router");
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin:`${process.env.CORS_CLIENT_HOST}`,
    methods:["GET","POST"]
	}
});

app.use("/*",cors());
app.use(express.json());
app.use(userRouter);

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(process.env.APP_PORT,()=>{
  console.log("Server listening at :" + process.env.APP_PORT);
});

