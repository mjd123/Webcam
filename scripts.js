const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    .then(media => {
      console.log(media);
      video.src = window.URL.createObjectURL(media);
      video.play();
    })
    .catch(error => {
      console.log('error');
    });
};

function videoToCanvas() {
  const height = video.videoHeight - 100;
  const width = video.videoWidth - 100;
  canvas.width = width;
  canvas.height = height;
  canvas.src = 'blob:http://127.0.0.1:3000/2efc298c-bbb9-4194-a066-e5618391ffaf';

  setInterval(function () {
    ctx.drawImage(video, 50, 0, width - 100, height - 100);
    let imgd = ctx.getImageData(0, 0, width, height); // the pixels

    imgd = rgbMinMax(imgd); //runs invert
    ctx.putImageData(imgd, 0, 0); //putting pixels back
  }, 20);
};

const sliders = document.querySelectorAll('.rgb input');

/*function rgbInvert (pix){ //invert pixels
  for (var i = 0, n = pix.data.length; i < n; i += 4) {
    pix.data[i  ] = 255 - pix.data[i  ]; // red
    pix.data[i+1] = 255 - pix.data[i+1]; // green
    pix.data[i+2] = 255 - pix.data[i+2]; // blue
    // i+3 is alpha (the fourth element)
  }
  return pix;
};
*/

function rgbMinMax(pix) {
  for (var i = 0, n = pix.data.length; i < n; i += 4) {
    pix.data[i] = pix.data[i] - (sliders[0].value / 2 - sliders[1].value); // red
    pix.data[i + 1] = pix.data[i + 1] - (sliders[2].value / 2 - sliders[3].value); // green
    pix.data[i + 2] = pix.data[i + 2] - (sliders[4].value / 2 - sliders[5].value); // blue
    // i+3 is alpha (the fourth element)
  }

  return pix;
}

function takePhoto() {
  var dataURL = canvas.toDataURL('image/jpeg'); //photo data

  var elem = document.createElement('a');
  elem.download = 'user.jpeg';
  elem.href = dataURL;
  elem.setAttribute('height', '100');
  elem.setAttribute('width', '100');
  elem.innerHTML = `<img src="${dataURL}" alt="Webcam-photo" />`;

  strip.appendChild(elem);

  snap.play(); // snap audio
  snap.currentTime = 0;
};

getVideo();

video.addEventListener('canplay', videoToCanvas);
