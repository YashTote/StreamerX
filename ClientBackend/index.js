const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: "http://localhost:5600/",
});
const wrtc = require("wrtc");
const sendio = require("socket.io-client");
const sendsocket = sendio("http://localhost:5600/");
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let localServer = null;
let remotePc;

io.on("connection", (socket) => {
  console.log("ESTABLISHED!");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    // console.log(msg);
  });

  socket.on("local connection offer", (msg) => {
    io.emit("client offer", msg);
    // console.log('connection request received!',msg);
  });

  socket.on("local ICE offer", (offer) => {
    // console.log(offer.sdpMid);
    if (!offer.candidate) return;
    const tempice = {
      candidate: offer.candidate,
      sdpMid: offer.sdpMid,
      sdpMLineIndex: offer.sdpMLineIndex,
    };
    io.emit("client ICE offer", tempice);
  });

  // let remotePc,
  //   localServer = null;

  // function onCreateSessionDescriptionError(error) {
  //   console.log(`Failed to create session description: ${error.toString()}`);
  // }

  // socket.on("local connection offer", function (msg) {
  //   console.log(msg);
  //   remotePc = new RTCPeerConnection(localServer);
  //   console.log(remotePc);

  //   remotePc.setRemoteDescription(msg).then(() => {
  //     console.log("Remote pc remoteDescription Complete !!!");
  //     remotePc.createAnswer(
  //       onCreateAnswerSuccess,
  //       onCreateSessionDescriptionError
  //     );
  //   });
  //   remotePc.onicecandidate = (e) => onIceCandidate(e);
  //   remotePc.onconnectionstatechange = (e) => {
  //     console.log(
  //       `State Changed to ${remotePc.iceConnectionState} due to ${e}`
  //     );
  //   };
  //   // remotePc.ontrack = gotRemoteStream;
  // });
  // function onCreateAnswerSuccess(desc) {
  //   console.log(`Answer ${desc}`);
  //   remotePc.setLocalDescription(desc, () => {
  //     console.log("remote pc local desc compl");
  //     sendsocket.emit("server connection answer", desc);
  //   });
  // }

  // socket.on("local ICE offer", (event) => {
  //   console.log(event);
  //   if (!event.candidate) return;
  //   const tempice = {
  //     candidate: event.candidate,
  //     sdpMid: event.sdpMid,
  //     sdpMLineIndex: event.sdpMLineIndex,
  //   };
  //   console.log(tempice);
  //   remotePc.addIceCandidate(tempice).then(
  //     () => {
  //       console.log("ICECandidate success!");
  //     },
  //     (err) => {
  //       console.log(err.toString());
  //     }
  //   );
  // });

  // function onIceCandidate(event) {
  //   if (!event.candidate) return;
  //   const tempice = {
  //     candidate: event.candidate.candidate,
  //     sdpMid: event.candidate.sdpMid,
  //     sdpMLineIndex: event.candidate.sdpMLineIndex,
  //   };
  //   sendsocket.emit("server ice answer", tempice);
  //   console.log(`LOCAL ICE candidate:
  //  ${event.candidate ? event.candidate.candidate : "(null)"}`);
  // }

  // function gotRemoteStream(event) {
  //   console.log(event.streams);
  //   if (remote_user.srcObject != event.streams[0]) {
  //     remote_user.srcObject = event.streams[0];
  //     console.log("RemotePC received remote stream", event);
  //   }
  // }
  /////// -----------------------
});
// const localStream = window.localStream;
sendsocket.emit("fromIndex.js", "0fffffxxx");

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
