const picContainer = document.getElementById("picContainer")
const PicPicker = document.getElementById("PicPicker")
const myfile = document.getElementById("file")
// const retake = document.getElementById("retake")

// retake.addEventListener("click",()=>{
//     restart()
// })


// function restart() {             // ?
//     PicPicker.style.display = "block"
//     picContainer.style.display = "none"
//     picContainer.innerHTML = '<img src="./public/undraw_Upload_re_pasx.png" id="pic" width="720" height="560"></img>'
    

// }


PicPicker.addEventListener("click", () => {
    PicPicker.style.display = "none"
    picContainer.style.display = "block"
})



const imageUpload = document.getElementById('file')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
    console.log("loading models")
    setup()
})

function setup() {
    console.log("ready")
    myfile.addEventListener("change", (event) => {
        let file = "h";
        const files = event.target.files
        for (const image of files) {
            if (image.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imgElement = document.createElement('img');
                    imgElement.classList.add("resultImage")
                    imgElement.src = e.target.result;
                    file = imgElement
                    runModel(file)
                    picContainer.innerHTML = ""
                    picContainer.appendChild(imgElement);
                };

                reader.readAsDataURL(image);

                console.log("setup done")
            }
        }


    })
}


function runModel(file) {

    console.log("init machine learning models")

    file.addEventListener('load', async () => {

        const canvas = await faceapi.createCanvasFromMedia(file)
        document.body.append(canvas)
        const displaySize = { width: file.width, height: file.height }
        faceapi.matchDimensions(canvas, displaySize)

        console.log("model running")

        setTimeout(async () => {     // pass element here to detect the face
            const detections = await faceapi.detectAllFaces(file,
                new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

            console.log(detections)

            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)   // NOT WORK WELL WITH RESPONSIVENESS
            
            console.log("DONE!")
        },0);
    })
}




