Select an image and create a copy. Canvas optimised for 600 X 600px.

Select the bony anatomy to include.  12 is a reasonable maximum for learning mode on current layout.  

In paint, colour over each area of interest with a different, non-gray colour and make note of the RGB values.  This is the masked image.

In paint, draw round the outlines of the area of interest in (default yellow) colour.  Process these at 85% sensitiviy to remove the black/white elements and save with transparent background.
http://transparent.imageonline.co/

Instantiate these images on the HTML page with img tags.  Use a suitable naming convention.

declare the masked image

declare the outline images (x, y, width, height, image, name). Names must be identical between button and outline object as used in checker function.

push each outline to the outline array

declare the buttons required (x, y, width, height, text, name). Names must be identical between button and outline object as used in checker function.
Text in CAPS.  Add an extra if statement in draw method if long name requires smaller text.  
Adjust Y positons as required

push each button the the button array inside the reset button array function.  Recalculate the Y value declaration in the for loop if necessary

fill in the colour data and bone names in the checker function

complete the switch statement in the UI function matching the returned bone name to the outline.draw required

double check that the 'CORRECT' floating message triggers in the studyMode function are displayed in the desired place

match the buttons to the desired outline(s) to be displayed in learning mode in the buttonHandler function

insert the HTML id of the display image in the drawBackground function call in the animate function

Test, rename the HTML file and place HTML, CSS and JS files, along with all assets in the relevent gitHub folder.  Double check the filepaths for the images in the HTML file
