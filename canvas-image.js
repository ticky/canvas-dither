var imageDisplay, displayCanvas, displayContext, displayImage, displayImageData, originalImage;
var worker		= new Worker('canvas-image-worker.js');
var fileReader	= new FileReader();

function draw () {

	displayImage				= new Image();
	displayImage.src			= originalImage;

	displayCanvas.width			= displayImage.width;
	displayCanvas.height		= displayImage.height;

	displayContext				= displayCanvas.getContext('2d');

	displayContext.drawImage(displayImage, 0, 0);

	displayImageData			= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height);

	var tmpGreyscaleMethod		= (document.getElementById('rdo_greyscale_luminance').checked) ? "luminance" : (document.getElementById('rdo_greyscale_average').checked) ? "average" : (document.getElementById('rdo_greyscale_disable').checked) ? "" : "luminance" ;
	var tmpDitherMethod			= (document.getElementById('rdo_dither_atkinson').checked) ? "atkinson" : (document.getElementById('rdo_dither_threshold').checked) ? "threshold" : "atkinson" ;
	var tmpDitherThreshold		= document.getElementById('threshold').value;
	var tmpReplaceColours 		= document.getElementById('chk_replace_colours').checked;
	var tmpReplaceBlack = {
		r: document.getElementById('rep_black_r').value,
		g: document.getElementById('rep_black_g').value,
		b: document.getElementById('rep_black_b').value,
		a: document.getElementById('rep_black_a').value
	}
	var tmpReplaceWhite = {
		r: document.getElementById('rep_white_r').value,
		g: document.getElementById('rep_white_g').value,
		b: document.getElementById('rep_white_b').value,
		a: document.getElementById('rep_white_a').value
	}

	if (window.console && window.console.time) {
		console.log("Starting Web Worker for image (" + displayCanvas.width + "x" + displayCanvas.height + ", Greyscale Method: " + tmpGreyscaleMethod + ", Dither Method: " + tmpDitherMethod + ")");
		console.time("Web worker took");
	}

	worker.postMessage( {
			image: {
				data:				displayImageData,
				width:				displayCanvas.width,
				height:				displayCanvas.height
			},
			processing: {
				greyscaleMethod:	tmpGreyscaleMethod,
				ditherMethod:		tmpDitherMethod,
				ditherThreshold:	tmpDitherThreshold,
				replaceColours:		tmpReplaceColours,
				replaceColourMap: {
					black: tmpReplaceBlack,
					white: tmpReplaceWhite
				}
			}
		});

}

worker.addEventListener('message', function (e) {

	displayContext			= displayCanvas.getContext('2d');

	if (window.console && window.console.time)
		console.timeEnd("Web worker took");

	displayContext.putImageData(e.data.image.data, 0, 0);

	if (document.getElementById('rdo_format_png').checked == true) {

		imageDisplay.src	= displayCanvas.toDataURL("image/png");

	} else if (document.getElementById('rdo_format_gif').checked == true) {

		imageDisplay.src	= displayCanvas.toDataURL("image/gif");

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

function setup () {

	// Detect Canvas Support
	displayCanvas	= document.createElement('canvas');
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