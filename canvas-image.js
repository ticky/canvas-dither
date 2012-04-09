var displayCanvas, displayContext, displayImage, displayImageData, originalImageData;

function draw()
{

	displayImage			= new Image();
	displayImage.src		= 'target.png';

	displayCanvas.width		= displayImage.width;
	displayCanvas.height	= displayImage.height;

	displayContext			= displayCanvas.getContext('2d');

	displayContext.drawImage(displayImage, 0, 0);

	displayImageData		= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height);	

	if (document.getElementById('rdo_lum').checked == true)
	{

		greyscale_luminance(displayImageData);

	}
	else if (document.getElementById('rdo_ave').checked == true)
	{

		greyscale_average(displayImageData);

	}

	displayContext.putImageData(displayImageData, 0, 0);

}

// Convert image data to greyscale based on luminance.
function greyscale_luminance(image)
{

	for (var i = 0; i <= image.data.length; i += 4)
	{

		image.data[i] = image.data[i + 1] = image.data[i + 2] =
			Math.round(image.data[i] * 0.21 + image.data[i + 1] * 0.71 + image.data[i + 2] * 0.07);

	}

	return image;

}

// Convert image data to greyscale based on average of R, G and B values.
function greyscale_average(image)
{

	for (var i = 0; i <= image.data.length; i += 4)
	{

		image.data[i] = image.data[i + 1] = image.data[i + 2] =
			Math.round((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3);

	}

	return image;

}

function setup()
{

	// Detect Canvas Support
	displayCanvas = document.getElementById('display');

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