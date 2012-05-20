var imageDisplay, displayCanvas, displayContext, displayImage, displayImageData;
var originalImage;
var worker = new Worker('canvas-image-worker.js');
var fileReader = new FileReader();

function draw() {

	displayImage				= new Image();
	displayImage.src			= originalImage;

	displayCanvas.width			= displayImage.width;
	displayCanvas.height		= displayImage.height;

	displayContext				= displayCanvas.getContext('2d');

	displayContext.drawImage(displayImage, 0, 0);

	displayImageData			= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height);

	var tmpGreyscaleMethod		= (document.getElementById('rdo_lum').checked) ? "luminance" : (document.getElementById('rdo_ave').checked) ? "average" : "luminance" ;
	var tmpDitherMethod			= (document.getElementById('rdo_atkinson').checked) ? "atkinson" : (document.getElementById('rdo_threshold').checked) ? "threshold" : "atkinson" ;
	var tmpDitherThreshold		= document.getElementById('threshold').value;

	worker.postMessage( {
			image: {
				data:				displayImageData,
				width:				displayCanvas.width,
				height:				displayCanvas.height
			},
			processing: {
				greyscaleMethod:	tmpGreyscaleMethod,
				ditherMethod:		tmpDitherMethod,
				ditherThreshold:	tmpDitherThreshold
			}
		});

}

worker.addEventListener('message', function (e) {

	displayContext				= displayCanvas.getContext('2d');

	displayContext.putImageData(e.data.image.data, 0, 0);

	if (document.getElementById('rdo_png').checked == true) {

		imageDisplay.src = displayCanvas.toDataURL("image/png");

	} else if (document.getElementById('rdo_gif').checked == true) {

		imageDisplay.src = displayCanvas.toDataURL("image/gif");

	} else if (document.getElementById('rdo_jpeg').checked == true) {

		imageDisplay.src = displayCanvas.toDataURL("image/jpeg");

	}

}, false);

fileReader.onload = function (e) {
	originalImage = e.target.result;
	document.getElementById('displayImage').src = e.target.result;
}

function handleFileSelect (e) {
	var files = e.target.files;

    fileReader.readAsDataURL(e.target.files[0]);
}

function setup() {

	// Detect Canvas Support
	displayCanvas	= document.getElementById('displayCanvas');
	imageDisplay	= document.getElementById('displayImage');

	if (displayCanvas.getContext) {

		document.getElementById('renderbtn').onclick	= function() { draw(); };
		document.getElementById('fileSelect').addEventListener('change', handleFileSelect, false);
		originalImage = document.getElementById('displayImage').src;

	} else {

		alert("Hi there, you're using an older browser which doesn't support Canvas, so unfortunately I can't show you this demo. Sorry!");

	}

}

window.onload = setup;