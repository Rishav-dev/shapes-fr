var canvas;
var context;
let isDrawing;

window.onload = function () {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.width = 224;
  canvas.height = 224;
  context.strokeStyle = "#FFFFFF";
  context.lineWidth = 7;

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

const URL = "https://teachablemachine.withgoogle.com/models/la0AkB7bG/";

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
}
init();

async function predict() {
  const prediction = await model.predict(canvasElement);
  console.log(prediction);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

async function input() {
  canvasElement = document.getElementById("canvas");
  await predict();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
document.querySelector('#download').addEventListener('click', ()=> {
  var canvas = document.querySelector("#canvas");
  var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  
  var element = document.createElement('a');
  var filename = 'test.png';
  element.setAttribute('href', image);
  element.setAttribute('download', filename);

  element.click();
})
