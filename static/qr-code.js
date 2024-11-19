const video = document.createElement("video");
let streambox;
let isClosed = false; // 閉じるボタンが押されたかどうかを判定する変数

function onClickQR() {
    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");
    const closeButtonSize = 30; // 閉じるボタンのサイズ
    const outputData1 = document.getElementById("lotno");
    const outputData2 = document.getElementById("kind");

    startCamera();

    // function drawLine(begin, end, color) {
    //     canvas.beginPath();
    //     canvas.moveTo(begin.x, begin.y);
    //     canvas.lineTo(end.x, end.y);
    //     canvas.lineWidth = 4;
    //     canvas.strokeStyle = color;
    //     canvas.stroke();
    // }

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = false;
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            canvas.font = 'bold 20px Arial';
            canvas.fillStyle = 'red';
            canvas.fillText('LotNoスキャン', 10, 20);

            // 閉じるボタンを描画
            drawCloseButton();

            if (isClosed) {
                stopCamera();
                return;
            }

            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code && code.data.length > 0) {
                processQRCode(code.data);
                stopCamera();
                return;
            }
        }
        requestAnimationFrame(tick);
    }

    function drawCloseButton() {
        canvas.fillStyle = 'black';
        canvas.fillRect(canvasElement.width - closeButtonSize - 10, 10, closeButtonSize, closeButtonSize);
        canvas.fillStyle = 'white';
        canvas.font = 'bold 20px Arial';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.fillText('×', canvasElement.width - closeButtonSize / 2 - 10, 10 + closeButtonSize / 2);
    }

    function processQRCode(data) {
        const commaIndex = data.indexOf(',');
        if (commaIndex !== -1) {
            outputData1.value = data.substr(0, commaIndex);
            outputData2.value = data.substr(commaIndex + 1);
        } else {
            outputData1.value = data;
        }
        var event = new Event('change');
        outputData1.dispatchEvent(event);
        outputData2.dispatchEvent(event);
    }

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: 280, height: 240 } })
            .then(function (stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                streambox = stream;
                isClosed = false; // ループを再開する
                requestAnimationFrame(tick);
            })
            .catch(function (err) {
                console.error('Error accessing the camera: ', err);
                alert('カメラへのアクセスが拒否されました。設定を確認してください。');
            });
    }

    function stopCamera() {
        streambox.getTracks().forEach(function (track) {
            track.stop();
        });
        canvasElement.hidden = true;
    }

    // 閉じるボタンのクリックイベント
    canvasElement.addEventListener('click', function (event) {
        const rect = canvasElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 閉じるボタンの範囲内をクリックしたかどうかを確認
        if (x >= canvasElement.width - closeButtonSize - 10 && x <= canvasElement.width - 10 &&
            y >= 10 && y <= 10 + closeButtonSize) {
            // 閉じるボタンがクリックされた場合の処理
            isClosed = true;
        }
    });
}
