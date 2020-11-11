(e => {
    'use strict';

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Settings (Enter info here)
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    const azureCognitionSubscriptionKey = ''; //Subscription key from Azure Cognitive Services
    const azureRegion = ''; //An azure region string (westeurope, eastus, etc)


    //These settings can have defaults set to the right of the || symbol, or passed in via the URL.
    const clearTime = +uripart('cleartime') || 4; // Seconds
    const maxWords = uripart('maxwords') || 250; //Max words to show on the screen
    const autopunctuation = uripart('autopunctuation') || true; //At the end of a phase, punctuation such as periods or qustion marks are automatically added using AI.
    let subtitleStyle = uripart('style') || '';
    const autoShutoffTime = 15 * 60 * 1000; //After 15 minutes of silence, the connection to the STT service will close to save cost. The obs source will need restarted to connect again.



    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // LOGIC
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    var SpeechSDK;
    var recognizer;
    var idleTimeout;
    var connectTimeout;
    var subtitles = document.querySelector('#subtitle');

    document.addEventListener("DOMContentLoaded", function () {
        if (!!window.SpeechSDK)
            SpeechSDK = window.SpeechSDK;

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureCognitionSubscriptionKey, azureRegion);
        speechConfig.enableDictation();
        speechConfig.speechRecognitionLanguage = "en-US";
        if (autopunctuation !== true)
            speechConfig.setServiceProperty('punctuation', 'explicit', SpeechSDK.ServicePropertyChannel.UriQueryParameter);
        var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (s, e) => {
            //console.log(`RECOGNIZING: Text=${e.result.text}`);
            updateSubtitles(e.result.text, true);
            if (idleTimeout) {
                clearTimeout(idleTimeout);
                idleTimeout = null;
            }
            idleTimeout = setTimeout(function () {
                recognizer.stopContinuousRecognitionAsync();
                subtitles.innerHTML = 'Connected timed out. Please refresh/toggle OBS browser source to reconnect.';
            }, autoShutoffTime);
        };

        recognizer.recognized = (s, e) => {
            //console.log(`RECOGNIZED: Text=${JSON.stringify(e.result)}`);
            if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
                updateSubtitles(e.result.text, false);
            };
        };

        recognizer.canceled = (s, e) => {
            // console.log(`CANCELED: Reason=${e.reason}`);

            // if (e.reason == CancellationReason.Error) {
            //     console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
            //     console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
            //     console.log("CANCELED: Did you update the subscription info?");
            // }

            recognizer.stopContinuousRecognitionAsync();
            subtitles.innerHTML = 'Connection refused. Please check subscription key and region and refresh/toggle OBS browser source to reconnect.';
        };

        recognizer.sessionStopped = (s, e) => {
            recognizer.stopContinuousRecognitionAsync();
            subtitles.innerHTML = 'Connected closed. Please refresh/toggle OBS browser source to reconnect.';
        };

        recognizer.sessionStarted = (s, e) => {
            if(connectTimeout){
                clearTimeout(connectTimeout);
                connectTimeout = null;
            }
            subtitles.innerHTML = 'Connected - Start Talking';
        };

        // Set Styles of Subtiltle Text
        updateSubtitleStyle(subtitleStyle);
        window.addEventListener('obsSourceActiveChanged', function (event) {
            if (event.detail.active === true) {
                location.reload();
            }
            else {
                recognizer.stopContinuousRecognitionAsync();
            }
        });
        connectTimeout = setTimeout(function () {
            subtitles.innerHTML = 'Unable to connect. Please ensure your OBS is started with the flag --use-fake-ui-for-media-stream.';
        }, 15000);
        recognizer.startContinuousRecognitionAsync();
    });

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Update Subtitles Style
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function updateSubtitleStyle(style) {
        subtitles.style = style;
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Update Subtitles
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function updateSubtitles(speech, timeout) {
        subtitles.innerHTML = getMaxWords(speech);

        // Clear Text after moments of silence.
        if (timeout) {
            clearTimeout(updateSubtitles.ival);
            updateSubtitles.ival = setTimeout(async ival => {
                subtitles.innerHTML = ' ';
            }, (+clearTime) * 1000);
        }
        return subtitles.innerHTML;
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Ensure only maxWords are displayed on the screen
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function getMaxWords(text) {
        let words = text.split(' ');
        return words.slice(-maxWords).join(' ');
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Get URI Parameters
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function uripart(key) {
        const params = {};
        const href = location.href;

        if (href.indexOf('?') < 0) return '';

        href.split('?')[1].split('&').forEach(m => {
            const kv = m.split('=');
            params[kv[0]] = kv[1];
        });

        if (key in params) return decodeURIComponent(params[key]);

        return '';
    }

})();
