const Recorder = require ('audio-recorder-js');
 
const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
 
const recorder = new Recorder(audioContext, {
  // An array of 255 Numbers
  // You can use this to visualize the audio stream
  // If you use react, check out react-wave-stream
  onAnalysed: data => console.log(data),
  numChannels: 2,
  sampleRate: 44100,
  sampleBits: 16,  // 8 or 16
  bufferLen: 4096,
  mimeType:'audio/wav'
});
 
let isRecording = false;
let blob = null;
 
navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => recorder.init(stream))
  .catch(err => console.log('Uh oh... unable to get stream...', err));
 
function startRecording() {
  recorder.start()
    .then(() => isRecording = true);
}
 
function stopRecording() {
  recorder.stop()
    .then(({blob, buffer}) => {
      blob = blob;
 
      // buffer is an AudioBuffer
    });
}
 
function download() {
  Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
}

global.window.download = download;
global.window.stopRecording = stopRecording;
global.window.startRecording = startRecording;