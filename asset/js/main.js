const videoLive = document.getElementById('videoLive');

const buttonStart = document.getElementById('buttonStart');
const buttonStop = document.getElementById('buttonStop');
const downloadLink = document.querySelector('a[download]');

let mediaRecorder;
let recordedChunks = [];

// Initialize Video Stream
async function initializeStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoLive.srcObject = stream;

        // Setup MediaRecorder
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

        mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        });

        mediaRecorder.addEventListener('stop', () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

           

            // Update the download link
            downloadLink.href = url;
            downloadLink.download = 'recorded-video.webm';
        });
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}


buttonStart.addEventListener('click', () => {
    mediaRecorder.start();
    buttonStart.setAttribute('disabled', 'true');
    buttonStop.removeAttribute('disabled');
    recordedChunks = [];
});

buttonStop.addEventListener('click', () => {
    mediaRecorder.stop();
    buttonStart.removeAttribute('disabled');
    buttonStop.setAttribute('disabled', 'true');
});

initializeStream();
