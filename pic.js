const picContainer = document.getElementById("picContainer")
const PicPicker = document.getElementById("PicPicker")
const myfile = document.getElementById("file")
const labels = document.querySelectorAll(".label")

const linkRunner = document.getElementById("link-runner")
const url = document.getElementById("url")



Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
    console.log("loading models")
    setup()
})




linkRunner.addEventListener("click", () => {
    PicPicker.style.display = "none"
    picContainer.innerHTML = ""
    picContainer.style.display = "block"

    if (url.value !== "") {
        const imgElementCode = `<img src="${url.value}" id="resultImage" class="resultImage" crossorigin="anonymous">`
        picContainer.innerHTML = imgElementCode
        const file = document.getElementById("resultImage")
        runModel(file)
    }
    else {

        const imgElement = document.createElement("img")
        imgElement.src = "./public/undraw_Page_not_found_re_e9o6.png";
        picContainer.appendChild(imgElement);

    }

})


labels.forEach((label) => {
    label.addEventListener("click", () => {
        PicPicker.style.display = "none"
        picContainer.style.display = "block"
    })
})




function setup() {
    console.log("ready")
    myfile.addEventListener("change", (event) => {
        let file = "";
        const files = event.target.files
        for (const image of files) {
            if (image.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imgElement = document.createElement('img');
                    imgElement.classList.add("resultImage")
                    imgElement.src = e.target.result;
                    file = imgElement
                    console.log(file)
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
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)   // NOT WORK WELL WITH RESPONSIVENESS

            console.log("DONE!")
        }, 0);
    })
}







