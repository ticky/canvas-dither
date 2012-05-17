var imageDisplay, displayCanvas, displayContext, displayImage, displayImageData;

function draw()
{

	displayImage				= new Image();
	displayImage.src			= 'target.jpg';

	displayCanvas.width			= displayImage.width;
	displayCanvas.height		= displayImage.height;

	displayContext				= displayCanvas.getContext('2d');

	displayContext.drawImage(displayImage, 0, 0);

	displayImageData			= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height);

	if (document.getElementById('rdo_lum').checked == true)
	{

		greyscale_luminance(displayImageData);

	}
	else if (document.getElementById('rdo_ave').checked == true)
	{

		greyscale_average(displayImageData);

	}

	dither_atkinson(displayImageData);


	displayContext.putImageData(displayImageData, 0, 0);

	imageDisplay.src = displayCanvas.toDataURL("image/png");

}

// Convert image data to greyscale based on luminance.
function greyscale_luminance(image)
{

	for (var i = 0; i <= image.data.length; i += 4)
	{

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(image.data[i] * 0.21 + image.data[i + 1] * 0.71 + image.data[i + 2] * 0.07, 10);

	}

	return image;

}

// Convert image data to greyscale based on average of R, G and B values.
function greyscale_average(image)
{

	for (var i = 0; i <= image.data.length; i += 4)
	{

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3, 10);

	}

	return image;

}

// Apply Atkinson Dither to Image Data
function dither_atkinson(image)
{

	imageWidth	= image.width;
	imageLength	= image.data.length

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += 4)
	{

		if (image.data[currentPixel] <= 128)
		{

			newPixelColour = 0;

		}
		else
		{

			newPixelColour = 255;

		}

		err = parseInt((image.data[currentPixel] - newPixelColour) / 8, 10);
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err;
		image.data[currentPixel + 8]						+= err;
		image.data[currentPixel + (4 * imageWidth) - 4]		+= err;
		image.data[currentPixel + (4 * imageWidth)]			+= err;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err;
		image.data[currentPixel + (8 * imageWidth)]			+= err;

		image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

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