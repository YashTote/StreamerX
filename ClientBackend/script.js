let socketReceive = io();
let socketEmit = io("http://localhost:5600/");
const remote_user = document.getElementById("remote-user");
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socketEmit.emit("chat message", input.value);
    socketEmit.emit("answer_success", "Answer");
    input.value = "";
  }
});

socketReceive.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
let remotePc,
  localServer = null;

function onCreateSessionDescriptionError(error) {
  console.log(
    `Failed to create session description: ${error.toString()}`
  );
}

remote_user.onloadedmetadata = () => {
  console.log(`${remote_user.videoWidth}`);
};
remote_user.onresize = () =>{
  console.log(remote_user.videoWidth)
}
socketReceive.on("client offer", function (msg) {
  console.log(msg);
  remotePc = new RTCPeerConnection(localServer);
  console.log(remotePc);

  remotePc.setRemoteDescription(
    msg,
    () => {
      console.log("Remote pc remoteDescription Complete !!!");
      remotePc.createAnswer(
        onCreateAnswerSuccess,
        onCreateSessionDescriptionError
      );
    },
    () => {
      console.log(`Failed to set session description`);
    }
  );
  remotePc.onicecandidate = (e) => onIceCandidate(e);
  remotePc.onconnectionstatechange = (e) => {
    console.log(
      `State Changed to ${remotePc.iceConnectionState} due to ${e}`
    );
  };
  remotePc.ontrack = gotRemoteStream;
});
function onCreateAnswerSuccess(desc) {
  console.log(`Answer ${desc}`);
  remotePc.setLocalDescription(desc, () => {
    console.log("remote pc local desc compl");
    socketEmit.emit("server connection answer", desc);
  });
  // socketEmit.
}

socketReceive.on("client ICE offer", (event) => {
  console.log(event);
  if (!event.candidate) return;
  const tempice = {
    candidate: event.candidate,
    sdpMid: event.sdpMid,
    sdpMLineIndex: event.sdpMLineIndex,
  };
  console.log(tempice);
  remotePc.addIceCandidate(tempice).then(
    () => {
      console.log("ICECandidate success!");
    },
    (err) => {
      console.log(err.toString());
    }
  );
  // console.log(`RemotePC ICE candidate:
  //  ${event.candidate ? event.candidate.candidate : "(null)"}`);
});

function onIceCandidate(event) {
  if (!event.candidate) return;
  const tempice = {
    candidate: event.candidate.candidate,
    sdpMid: event.candidate.sdpMid,
    sdpMLineIndex: event.candidate.sdpMLineIndex,
  };
  socketEmit.emit("server ice answer", tempice);
  console.log(`LOCAL ICE candidate:
 ${event.candidate ? event.candidate.candidate : "(null)"}`);
}

function gotRemoteStream(event) {
  console.log(event.streams);
  if (remote_user.srcObject != event.streams[0]) {
    remote_user.srcObject = event.streams[0];
    console.log("RemotePC received remote stream", event);
    // socketEmit.emit("answer_success", "answer");
    window.localStream = event.streams[0];
  }
}