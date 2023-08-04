const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: "http://localhost:3000/",
});
const port = process.env.PORT || 5600;
// const httpServer = createServer(app);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// const io = new Server(httpServer,{cors:"https://localhost:3000/"});
io.on("connection", (socket) => {
   socket.on("server connection answer", (msg) => {
    io.emit("remote connection offer", msg);
    // console.log(msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected.");
  });

  socket.on('server ice answer',(offer)=>{
    if (!offer.candidate) return;
    const tempice = {
      candidate: offer.candidate,
      sdpMid: offer.sdpMid,
      sdpMLineIndex: offer.sdpMLineIndex,
    };
    io.emit('remote ice offer', tempice);
    // console.log(offer);
  });
  socket.on('fromIndex.js', e =>{
    console.log(e);
  })

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
