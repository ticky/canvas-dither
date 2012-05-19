var imageDisplay, displayCanvas, displayContext, displayImage, displayImageData;
var worker = new Worker('canvas-image-worker.js');

function draw()
{

	displayImage				= new Image();
	displayImage.src			= 'target.jpg';

	displayCanvas.width			= displayImage.width;
	displayCanvas.height		= displayImage.height;

	displayContext				= displayCanvas.getContext('2d');

	displayContext.drawImage(displayImage, 0, 0);

	displayImageData			= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height);

	worker.postMessage({imageData: displayImageData});

}

// Oh dear, this isn't good.
worker.addEventListener('message', function(e) {

	displayContext				= displayCanvas.getContext('2d');

	displayContext.putImageData(e.data.imageData, 0, 0);

	if (document.getElementById('rdo_png').checked == true)
	{

		imageDisplay.src = displayCanvas.toDataURL("image/png");

	}
	else if (document.getElementById('rdo_gif').checked == true)
	{

		imageDisplay.src = displayCanvas.toDataURL("image/gif");

	}
	else if (document.getElementById('rdo_jpeg').checked == true)
	{

		imageDisplay.src = displayCanvas.toDataURL("image/jpeg");

	}

}, false);

function setup()
{

	// Detect Canvas Support
	displayCanvas	= document.getElementById('displayCanvas');
	imageDisplay	= document.getElementById('displayImage');

	if (displayCanvas.getContext)
	{

		document.getElementById('renderbtn').onclick	= function() { draw(); };

	}
	else
	{

		alert("Hi there, you're using an older browser which doesn't support Canvas, so unfortunately I can't show you this demo. Sorry!");

	}

}

window.onload = setup;