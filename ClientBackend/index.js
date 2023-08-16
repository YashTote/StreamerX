const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(http, {
  cors: "http://localhost:5500/",
});
const wrtc = require("wrtc");
const sendio = require("socket.io-client");
const { exec } = require("child_process");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const CallDetail = require('./models/userModel')


app.use(cors());
// app.use(express.json());
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/streamDB");

const sendsocket = sendio("http://localhost:5600/");
const port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.post("/ffmpeg_start", async (req, res) => {
  response1 = {
    streamId: req.body.StreamId,
    streamKey: req.body.StreamKey,
  };
  const addDetails = new CallDetail({userId: response1.streamId, key: response1.streamKey});
  await addDetails.save();

  // const command = `ffmpeg -i rtmp://localhost/live/livestream -c copy -f flv rtmp://a.rtmp.youtube.com/${response1.streamId}/${response1.streamKEY}`;
  // // Execute the command
  // exec(command, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error("Error:", error);
  //   } else {
  //     console.log("Command executed successfully");
  //   }
  // });
  console.log(response1);
  res.end(JSON.stringify(response1));
});

// let localServer = null;
// let remotePc;

// io.on("connection", (socket) => {
//   console.log("ESTABLISHED!");

//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//     // console.log(msg);
//   });

//   socket.on("local connection offer", (msg) => {
//     io.emit("client offer", msg);
//     // console.log('connection request received!',msg);
//   });

//   socket.on("local ICE offer", (offer) => {
//     // console.log(offer.sdpMid);
//     if (!offer.candidate) return;
//     const tempice = {
//       candidate: offer.candidate,
//       sdpMid: offer.sdpMid,
//       sdpMLineIndex: offer.sdpMLineIndex,
//     };
//     io.emit("client ICE offer", tempice);
//   });

//   // let remotePc,
//   //   localServer = null;

//   function onCreateSessionDescriptionError(error) {
//     console.log(`Failed to create session description: ${error.toString()}`);
//   }

//   socket.on("local connection offer", function (msg) {
//     // console.log(msg);
//     remotePc = new  wrtc.RTCPeerConnection(localServer);
//     // console.log(remotePc);

//     remotePc.setRemoteDescription(msg).then(() => {
//       console.log("Remote pc remoteDescription Complete !!!");
//       remotePc.createAnswer(
//         onCreateAnswerSuccess,
//         onCreateSessionDescriptionError
//       );
//     });
//     remotePc.onicecandidate = (e) => onIceCandidate(e);
//     remotePc.onconnectionstatechange = (e) => {
//       console.log(
//         `State Changed to ${remotePc.iceConnectionState} due to ${JSON.stringify(e)}`
//       );
//     };
//     remotePc.ontrack = gotRemoteStream;
//   });
//   function onCreateAnswerSuccess(desc) {
//     // console.log(`Answer ${JSON.stringify(desc.sdp)}`);
//     remotePc.setLocalDescription(desc, () => {
//       console.log("remote pc local desc compl");
//       sendsocket.emit("server connection answer", desc);
//     },
//     (err) =>{console.log(`Session Answer error ${err}`)},
//     );
//   }

//   socket.on("local ICE offer", (event) => {
//     // console.log(event);
//     if (!event.candidate) return;
//     const tempice = {
//       candidate: event.candidate,
//       sdpMid: event.sdpMid,
//       sdpMLineIndex: event.sdpMLineIndex,
//     };

//     // console.log(tempice);
//     remotePc.addIceCandidate((tempice)).then(
//       () => {
//         console.log("ICECandidate success!");
//       },
//       (err) => {
//         console.log(err.toString());
//       }
//     );
//   });

//   function onIceCandidate(event) {
//     if (!event.candidate) return;
//     const tempice = {
//       candidate: event.candidate.candidate,
//       sdpMid: event.candidate.sdpMid,
//       sdpMLineIndex: event.candidate.sdpMLineIndex,
//     };
//     sendsocket.emit("server ice answer", tempice);
//     console.log(`LOCAL ICE candidate:
//    ${event.candidate ? event.candidate.candidate : "(null)"}`);
//   }

//   function gotRemoteStream(event) {
//     console.log(event.streams[0].active);
//   }

//   // socket.on("start_srs", (msg) =>{

//   // })
//   /////// -----------------------
// });
// // const localStream = window.localStream;
// sendsocket.emit("fromIndex.js", "0fffffxxx");
// start_srs();
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
