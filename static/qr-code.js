
function onClickQR(){
    const video = document.createElement("video");
    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");
    const outputData1 = document.getElementById("lotno");
    const outputData2 = document.getElementById("kind");
    let streambox;


    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }


    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width:280, height:240} }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    streambox = stream;
    requestAnimationFrame(tick);
    });


    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = false;
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
            });
            if (code) {
//            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
//            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
//            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
//            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            if (code.data.length > 0 ){
                const commaIndex = code.data.indexOf(',');
                if (commaIndex !== -1){
                    outputData1.value = code.data.substr(0,code.data.indexOf(','));
                    outputData2.value = code.data.substr(code.data.indexOf(',')+1);
                }else{
                    outputData1.value = code.data;
                }
                streambox.getTracks().forEach(function(track) {
                track.stop();
                });
                canvasElement.hidden = true;

                var event = new Event('change');
                outputData1.dispatchEvent(event);
                outputData2.dispatchEvent(event);
                return;
            }
            }
        }
        requestAnimationFrame(tick);
    }
}
