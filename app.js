var canvas;
var context;
let isDrawing;

window.onload = function () {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 512;
  context.strokeStyle = "#913d88";
  context.lineWidth = 2;

  canvas.onmousedown = startDrawing;
  canvas.onmouseup = stopDrawing;
  canvas.onmousemove = draw;

  function startDrawing(e) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
  }

  function draw(e) {
    if (isDrawing == true) {
      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop;

      context.lineTo(x, y);
      context.stroke();
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }
};

const URL = "https://teachablemachine.withgoogle.com/models/O76CzEi4N/";

let model, canvasElement, labelContainer, maxPredictions;
canvasElement = document.getElementById("canvas");

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
  await predict();
  setInterval(async () => {
    canvasElement = document.getElementById("canvas");
    await predict();
  }, 1000);
}

async function predict() {
  const prediction = await model.predict(canvasElement);
  console.log(prediction);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}