# OBS STT Subtitles using Microsoft Azure Cognitive SDK

Welcome! This repo is a heavily modified and simplified version of https://github.com/stephenlb/twitch-tv-obs-subtitles that uses the Microsoft Azure Cognitive SDK for better STT results. This is the same service that Microsoft Cortana uses.

> Note: The micrsoft cognitive service is not free and you will need to provide this program with a subscription key in order to use it. See more info here: https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/

# Setup

Setup is extremely simple and the subtitles run locally. The only connection is directly to Microsoft via the SDK for the STT.

## Step 1 - Download code

Download the code as a zip file from github using the green button above.

## Step 2 - Extract files

Extract the files from the zip into a location on your hard drive.

## Step 2 - Add Microsoft Cognition subscriptioon key and region.

1. Open `subtitles.html`.
2. Enter your subscription key and region into the provided fields and save the file.

```javascript
    const azureCognitionSubscriptionKey = ''; //Subscription key from Azure Cognitive Services
    const azureRegion = ''; //An azure region string (westeurope, eastus, etc)
```

## Step 3 - Add OBS launch parameter

Currently, the OBS browser source window does not support showing the alert to allow microphone access in order to accept it. This launch parameter will allow microphone access to the OBS browser sources.

OBS bug documented here: https://obsproject.com/forum/threads/using-browser-as-source-camera-mic-not-blocked-but-crossed-out-camera-image-on-obs-screen.123776/

1. Locate and right click on the shortcut you use to open OBS.
2. Select "Properties"
3. In the "Target" box, add `--use-fake-ui-for-media-stream` to the very end. It should look simial to `"C:\Program Files (x86)\obs-studio\bin\64bit\obs64.exe" --use-fake-ui-for-media-stream`

Make sure to start OBS with this shortcut for the subtitles to work. If the subtitle program cannot access your microphone, a message will display after 15 seconds regarding this step.

## Step 4 - Add an OBS Browser Source

Add a new browser source in OBS. 

Option 1:
Check "Local File" and navigate to the subtitles.html file you downloaded earlier.

Option 2 (This method will allow for settings to be passed into the URL just like the original pubnub subtitle program):
Double click the subtitles.html file and open it in the browser. Copy the url into the OBS browser source. It should look similar to: `file:///C:/obs-subtitles-microsoft-cog/subtitles.html`

> Recommended, but optional:
Check the boxes for "Shutdown source when not visible" and "Refresh browser when scene becomes active". The program is configured to shut down and start up when the browser source changes from visiblility, but these will ensure the STT program is not running in the backround and always has a fresh start.

## Setup Complete!

Show the browser source and it should connect and begin transcribing.



<br><br>
# Additional Customizations

## Change Font Style

You can set the font display style using any valid CSS modifiers.
Some defaults are available for you.

 - Set Style: `?style=CSS_HERE`
 - Set Background White: `?style=background:%23white`
 - Set Font Red: `?style=color:%23red`
 - Set Text Padding: `?style=padding:10px`

Here are some pre-built options to try:

 - Clean: C:/obs-subtitles-cortana/subtitles.html?style=color%3Argba(0%2C0%2C0%2C.9)%3Btext-shadow%3A0%200%205px%20%23fff
 - CC Caption: C:/obs-subtitles-cortana/subtitles.html?style=background%3A%23000%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px


![closed-caption](https://user-images.githubusercontent.com/45214/81862816-1fe75300-951f-11ea-9cde-ebd7ad881654.gif)
 
 
 - Blue: C:/obs-subtitles-cortana/subtitles.html?style=color%3A%2300f%3Bfont-weight%3A400%3Btext-shadow%3A0%200%205px%20%23fff
 - Rainbow: C:/obs-subtitles-cortana/subtitles.html?style=background%3Alinear-gradient(to%20right%2Corange%2C%23ff0%2Cgreen%2C%230ff%2C%2300f%2Cviolet)%20100%25%3Bfont-weight%3A800%3B-webkit-background-clip%3Atext%3B-webkit-text-fill-color%3Atransparent%3Btext-shadow%3Anone
 
![rainbow](https://user-images.githubusercontent.com/45214/81860401-8b2f2600-951b-11ea-9a0d-a7513dd63f20.gif)

Sky is the limit!
Enjoy.

## Clear Text on Screen after you stop talking

We've added a new feature to allow the text to clear from the screen after a
moment of silence.
The default is set to `4 seconds`.
You can change this by setting the following:

> Don't go lower than 2 seconds. It will cause unexpected problems for you.

 - Clear Text after 5 Seconds: C:/obs-subtitles-cortana/subtitles.html?cleartime=5

Using the default of 4 seconds is recommended.

## Change Intro Text

By default the intro text is set to "Start talking."
You can change this value to anything you'd like:

 - Intro Text BLANK: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?introtext=%20
 - Intro Text "Hello!": https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?introtext=Hello!
 - Intro Text "Whatup": https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?introtext=Whatup

## Display Last Two Lines

Sometimes you don't want a wall of text.
You want to set the display to show only the last two lines.

There's a way to crop using CSS like this `bottom:92vh`.

> C:/obs-subtitles-cortana/subtitles.html?style=background%3A%23000%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px;bottom:92vh

![Closed Captions Last Two Lines](https://user-images.githubusercontent.com/45214/81858459-a3517600-9518-11ea-8963-1eb4faaea858.gif)

Change the CSS to match your desired display.  
For example you may wish to fine-tune the crop effect using the calc operator:

`bottom:calc(100vh%20+%201.3em)`

> C:/obs-subtitles-cortana/subtitles.html?style=background%3A%23000%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px;bottom%3Acalc(100vh%20%2B%201.3em)

## Set Max Words

Setting the maximum display words is easy using this URL parameter:

https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?maxwords=10

This will display a maximum of 10 words, just as an example.