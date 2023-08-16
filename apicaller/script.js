let ffmpeg_call = document.getElementById("ffmpeg_form");
const idKey = {
  StreamId: document.getElementById("StreamId").value,
  StreamKey: document.getElementById("StreamKey").value,
};
ffmpeg_call.addEventListener("submit", (e) => {
  fetch("http://localhost:3000/ffmpeg_start", {
    method: "POST",
    headers:{"Content-Type":"application/JSON"},
    body: JSON.stringify(idKey),
  });
  console.log(e);
  e.preventDefault();
});
