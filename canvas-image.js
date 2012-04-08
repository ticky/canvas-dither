var displayCanvas, displayContext, displayImage, displayImageData;

function draw(currenty)
{

	for (var currentx = 0; currentx < displayContext.canvas.width; currentx++)
	{

		tmpcolorlum = (1 - ( 0.299 * (displayImageData[((currenty)*displayContext.canvas.width)+currentx+(3 * (currentx + (currenty * displayContext.canvas.width)))]/255) + 0.587 * (displayImageData[((currenty)*displayContext.canvas.width)+currentx+(3 * (currentx + (currenty * displayContext.canvas.width)))+1]/255) + 0.114 * (displayImageData[((currenty)*displayContext.canvas.width)+currentx+(3 * (currentx + (currenty * displayContext.canvas.width)))+2]/255)/255));

		displayContext.fillStyle = 'rgb('+Math.round((1-tmpcolorlum)*255)+','+Math.round((1-tmpcolorlum)*255)+','+Math.round((1-tmpcolorlum)*255)+')';

		displayContext.fillRect(currentx, currenty, 1, 1);

	}

	if(currenty < displayContext.canvas.height)
	{

		setTimeout(function() { draw(currenty+1); }, 0);

	}

}

function setup()
{

	// Detect Canvas Support
	displayCanvas = document.getElementById('display');

	if (displayCanvas.getContext)
	{

		document.getElementById('renderbtn').onclick	= function() { draw(0); };

		displayImage			= new Image();
		displayImage.src		= 'target.png';

		displayCanvas.width		= displayImage.width;
		displayCanvas.height	= displayImage.height;

		displayContext			= displayCanvas.getContext('2d');

		displayContext.drawImage(displayImage, 0, 0);

		displayImageData		= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height).data;

	}
	else
	{

		alert("Hi there, you're using an older browser which doesn't support Canvas, so unfortunately I can't show you this demo. Sorry!");
		
	}
	
}

window.onload = setup;