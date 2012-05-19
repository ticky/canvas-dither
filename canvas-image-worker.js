function draw(image_data)
{

	/*if (greyscale_method == "luminance")
	{*/

		greyscale_luminance(image_data);

	/*}
	else if (greyscale_method == "average")
	{

		greyscale_average(image_data);

	}*/

	/*if (dither_method == "atkinson")
	{

		dither_atkinson(image_data);

	}
	else if (dither_method == "threshold")
	{*/

		dither_threshold(image_data);

	/*}*/

	return image_data;

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

function dither_threshold(image)
{
	var threshold_value = 128; // parseInt(document.getElementById('threshold').value);

	for (var i = 0; i <= image.data.length; i += 4)
	{
		image.data[i] = image.data[i + 1] = image.data[i + 2] = (parseInt((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3, 10) > threshold_value) ? 255 : 0;
	}
}

self.addEventListener('message', function (e) {
  self.postMessage({imageData: draw(e.data.imageData)});
}, false);

/*function setup()
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

window.onload = setup;*/