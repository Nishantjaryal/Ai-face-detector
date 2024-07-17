
const Stop_button = document.getElementById("Stop_button")
const Start_button = document.getElementById("Start_button")
const video = document.getElementById('bgvid')


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(console.log("API's loaded Successfully")).then(startVideo)

async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        console.log('Video started');
    } catch (err) {
        console.error('Error starting video:', err);
    }
}



function stopVideo() {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        console.log('Video stopped');
    } else {
        console.log('No video to stop');
    }
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {     // pass element here to detect the face
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

        // console.log(detections)

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)   // NOT WORK WELL WITH RESPONSIVENESS

    }, 100);
})

Stop_button.addEventListener("click", stopVideo)
