// const  record_lyb  = require('./tst_record')
// import  record_lyb  from './tst_record'


URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record


var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

recordButton.disabled = false;
stopButton.disabled = true;
pauseButton.disabled = true;
//add events to those 2 buttons
recordButton.addEventListener("click", (e)=> {
    e.preventDefault();
    startRecording();   
});
stopButton.addEventListener("click", (e)=> {
    e.preventDefault();
    stopRecording();
});
pauseButton.addEventListener("click", (e)=> {
    e.preventDefault();
    pauseRecording();
});

let first_aya = document.getElementById("start-aya");
let last_aya = document.getElementById("end-aya");
let label1 = document.getElementById("label1");
let label2 = document.getElementById("label2");
let start_aya_num = document.getElementById("start-aya-num");
let end_aya_num = document.getElementById("end-aya-num");
let sura_aya = document.getElementById("sura-aya");
let sura_aya2 = document.getElementById("sura-aya2");

let select = document.getElementById("sura_select");
let select_value = select.value;

first_aya.style.border = "none";
last_aya.style.border = "none";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

select.addEventListener('change', (e)=>{
    e.preventDefault();

    select_value = select.value;
})

let start_test_btn = document.getElementById("start-test2");
start_test_btn.addEventListener('click', (e)=>{
    e.preventDefault();

    if (select_value == 0)
        first_aya.textContent = "المرجوا اختيار سورة أعلاه";
    else      
        first_aya.textContent = "...جاري التحميل";
    last_aya.textContent = "";
    label1.textContent = ""; 
    label2.textContent = "";
    start_aya_num.textContent = "";
    end_aya_num.textContent = "";
    sura_aya.textContent = "";
    sura_aya2.textContent = "";
    first_aya.style.border = "none";
    last_aya.style.border = "none";

    fetch("https://api.alquran.cloud/v1/surah/" + select_value)
    .then((response) => response.json())
    .then((json)=>{
    
    let num_ayas = json.data.numberOfAyahs;
    let end_aya = getRandomInt(num_ayas);
    while (end_aya < 9)
        end_aya = getRandomInt(num_ayas);
    let start_aya = getRandomInt(end_aya);
    while (end_aya - start_aya < 8 || end_aya - start_aya > 20)
        start_aya = getRandomInt(end_aya);
    
    label1.textContent = ":اقرأ من قوله تعالى"; 
    label2.textContent = ":إلى";   
    first_aya.style.border = "";
    last_aya.style.border = "";
    first_aya.textContent =  json.data.ayahs[start_aya].text;
    last_aya.textContent = json.data.ayahs[end_aya].text;
    sura_aya.textContent = "(" + json.data.name + "," + json.data.ayahs[start_aya].numberInSurah + ")";
    sura_aya2.textContent = "(" + json.data.name + "," + json.data.ayahs[end_aya].numberInSurah + ")";
    })
})




////////////////////


function startRecording() {
	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false;
	/*
    We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        
		/*
        create an audio context after getUserMedia is called
        sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		// document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
        
		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
        
		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
            */
           rec = new Recorder(input,{numChannels:1})
           
		//start the recording process
		rec.record()

		console.log("Recording started");
        
	}).catch(function(err) {
        //enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
        console.log("check000000");
        console.log(err);
	});
    console.log("check01");
}

function pauseRecording(){
    console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
        //pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	link.innerHTML = "Save to disk";

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	li.appendChild(link);
	
	//upload link
	var upload = document.createElement('a');
	upload.href="#";
	upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li);
}
// ////////////////////////////