var animationFrameID;

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
resizeCanvasToDisplaySize(canvas);


var analyser = Howler.ctx.createAnalyser();
Howler.masterGain.connect(analyser);

analyser.fftSize = 256; //determines how many data points were gonna collect
const bufferLength = analyser.frequencyBinCount; //half of fftSize
const dataArray = new Uint8Array(bufferLength); //holds all the data points collected from the sound.
const bufferLengthOffset = Math.floor(bufferLength * .35);

function animate() {
  analyser.getByteFrequencyData(dataArray);
  localArray = [...dataArray];

  x = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var barHeight;
  var barWidth = canvas.width / (bufferLength - bufferLengthOffset);


  for (let i = 0; i < bufferLength - bufferLengthOffset; i++) {
      barHeight = localArray[i];
      barHeight = barHeight / 255;
      barHeight = barHeight * canvas.height;

      if (i % 2 === 0){
        ctx.fillStyle = `rgb(245, 195, 255)`;

      }

      else {
        ctx.fillStyle = `rgb(255,255,255)`;
      }

      //FILL RECT (x,y, width, height);

      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth;
  }
  //////////////////////////////////////////////////////////

  animationFrameID = requestAnimationFrame(animate);
}

function resizeCanvasToDisplaySize(canvas) {
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // If it's resolution does not match change it
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}

window.onresize = function() {
  resizeCanvasToDisplaySize(canvas);
  findMaxDispChar();
  updateNowPlaying(currentSong);
}

animate();