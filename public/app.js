const video = document.getElementById("video");
const captureButton = document.getElementById("take-snap");
const context = canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.querySelector("h1.animated");
  h1.addEventListener("animationend", () => {
    h1.classList.remove("animated"); // Remove the initial animation class
  });
});

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing webcam:", err);
    alert("Unable to access webcam. Please allow webcam access.");
  });

// console.log(faceapi);

captureButton.addEventListener("click", async () => {
  // Draw the video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the canvas
  const imageData = canvas.toDataURL("image/png");
  output.innerHTML = `<img id="snap" src="${imageData}" alt="Captured Photo" />`;
  // Optional: Do something with the image data (e.g., send it to a server)

  run();
});
const MODEL_URL = "/models";
const run = async () => {
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    console.log("Models loaded successfully.");
  } catch (error) {
    console.error("Error loading face-api models:", error);
  }
  const face = document.getElementById("snap");

  let faceAiData = await faceapi
    .detectAllFaces(face)
    .withFaceLandmarks()
    .withFaceExpressions();

  // console.log(faceAiData);
  // const canvas = document.getElementById("canvas");
  // canvas.style.left = face.offsetLeft;
  // canvas.style.top = face.offsetTop;
  // canvas.height = face.height;
  // canvas.width = face.width;

  // faceAiData = faceapi.resizeResults(faceAiData, face);
  // faceapi.draw.drawDetections(canvas, faceAiData);

  const out = faceapi.createCanvasFromMedia(face);
  faceapi.draw.drawDetections(
    out,
    faceAiData.map((res) => res.detection)
  );
  faceapi.draw.drawFaceExpressions(out, faceAiData);
  console.log(faceAiData);
  const emotions = faceAiData[0].expressions;
  const mostProbableEmotion = Object.keys(emotions).reduce((a, b) =>
    emotions[a] > emotions[b] ? a : b
  );
  emo.innerHTML = `<p>${mostProbableEmotion}</p>`;
  // console.log(faceAiData[0].expressions.happy);
  const body = document.body;
  const colors = {
    happy: "#FFD700", // Golden Yellow
    angry: "#FF0000", // Bright Red
    sad: "#4682B4", // Steel Blue
    fearful: "#800080", // Deep Purple
    surprised: "#87CEEB", // Light Sky Blue
    disgusted: "#556B2F", // Olive Green
    neutral: "#D3D3D3", // Light Gray
  };
  body.style.backgroundColor = colors[mostProbableEmotion] || "#ffffff";
};
