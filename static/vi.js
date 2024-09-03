
const canvasElement = document.getElementById("vis_canvas");
const canvas = canvasElement.getContext("2d");
let currentShape = 1
let shapebox = [];
let shapebox_hand = [];
let currentIndex = -1;
let currentIndex_hand = -1;
let counter_hand = 0
let switch_del = false;
let buttons = document.getElementsByClassName("btn");
let counter = Array(15);//図形は15種類あり
let isDrawing = false;
let userInput = false;
let lastPosition = {x:null, y:null};
let length_shape = 0;
let lengthRangeNo =1;
let touchArea = {　xL: 40,  yU: 45,xR: 1600,yD: 660 }; // 左のX座標,上のY座標,右のX座標,下のY座標

counter.fill(0);//0で初期化

let ratio = window.devicePixelRatio || 1 ;
canvasElement.width = canvasElement.offsetWidth * ratio;
canvasElement.height = canvasElement.offsetHeight * ratio;
const image = new Image();
let imageAdd = new Image();

//ページ読み込み時に処理(canvasに画像表示)
window.addEventListener('DOMContentLoaded', () =>{
    image.src='../static/VIS2.gif';
    image.onload =()=>{
        background();
    };
    //作業者
    workers();
    workers2();
});


//関数_canvasに画像表示
function background(){
    image.width = canvasElement.width;
    image.height = canvasElement.height;
    canvas.drawImage(image,0 ,0, image.width, image.height);
}


//全長入力時にcanvasに全長線描写
const target_length = document.getElementById("length")
target_length.addEventListener('change', function(){
    length_shape = document.getElementById("length").value;
    redrawCanvas()
})
//関数_canvasに全長線
function length_draw(){
    if (length_shape != 0) {

        let xPos = (length_shape/100*22+20+length_shape/1000*4) ;
        if(lengthRangeNo === 2){
            xPos = (length_shape/100*110+20+length_shape/1000*20) ;
        }else if(lengthRangeNo === 3 || lengthRangeNo === 4){
            xPos = (length_shape/100*44+20+length_shape/1000*8) ;
        }
        canvas.beginPath();
        canvas.lineTo(xPos * ratio,45);
        canvas.lineTo(xPos * ratio,660);
        canvas.closePath();
        canvas.lineWidth = 5;
        canvas.strokeStyle = "black";
        canvas.stroke();
    }
}

//図形の切り替え
function kinds(kinds){
    currentShape = kinds;
    switch_del = false;
    isDrawing = false;
    const targetButton = document.getElementById(`b${kinds}`);
    $('.btn').removeClass('active');
    $(targetButton).addClass('active');
}


//図形の消去切り替え
function del(){
    if (switch_del) {
        switch_del = false;
        $('#del-button').removeClass('active');
    }else{
        switch_del = true;
        $('#del-button').addClass('active');
    };
}


//手書き切り替え
function hand(){
    if (isDrawing) {
        isDrawing = false;
        kinds(1);
    }else{
        isDrawing = true;
        switch_del = false;
        $('.btn').removeClass('active');
        $('#write-button').addClass('active');
    };
}
//手書きテキスト切り替え
function handText(){
    if (isDrawing){
        userInput = true;
        $('#input-button').addClass('active');
    }
}


//全長レンジ変更
function changeLength(){
    if(lengthRangeNo === 1){
        lengthRangeNo = 2 ;
    }else if(lengthRangeNo ===2){
        lengthRangeNo = 3 ;
    }else if(lengthRangeNo ===3){
        lengthRangeNo = 4 ;
    }else if(lengthRangeNo ===4){
        lengthRangeNo = 5 ;
    }else if(lengthRangeNo ===5){
        lengthRangeNo = 1 ;
    }
    redrawCanvas();
}
//全長レンジ描写
function changeLengthImage(){
    if(lengthRangeNo === 2){
        imageAdd.src='../static/VIS500.gif';
    }else if(lengthRangeNo === 3){
        imageAdd.src='../static/VIS1500.gif';
    }else if(lengthRangeNo === 4){
        imageAdd.src='../static/VIS1500-2.gif';
    }else if(lengthRangeNo === 5){
        imageAdd.src='../static/VIS3000.gif';
    }
    imageAdd.onload=()=>{
        if(lengthRangeNo === 4 || lengthRangeNo === 5){
            canvas.drawImage(imageAdd,0 ,0, image.width, image.height);
            length_draw();
            shapeRedraw();
            handShapeRedraw();
        }else{
            canvas.drawImage(imageAdd,0 ,700, image.width, 100);
        }
    }
}


//図形描写メイン処理
//図形、手書き、手書き入力、戻る、del、手書きdel
canvasElement.addEventListener('touchstart', function(event) {
    event.preventDefault();
    let offset = this.getBoundingClientRect();
    let touch = event.touches[0];
    let x = Math.trunc(touch.pageX - offset.left) * ratio;
    let y = Math.trunc(touch.pageY - offset.top) * ratio;
    if (!switch_del && !isDrawing){
        console.log(x,y);
        if (x >= touchArea.xL && x <= touchArea.xR && y >= touchArea.yU && y <= touchArea.yD) {
            //図形描写
            drawShape(x,y,currentShape);
            shapes_count(currentShape - 1,1);
            //配列処理
            currentIndex++;
            shapebox.splice(currentIndex);
            shapebox.push({x:x,y:y,shapes:currentShape});}
    }else if(!switch_del && isDrawing){
        //手書きテキスト
        if(userInput){
             let user = window.prompt("入力して下さい。")
            if(user !== "" && user !== null){
                currentIndex_hand++;
                shapebox_hand.push({ x, y, type: user, line: currentIndex_hand });
                canvasText(canvas, user, x, y);
            }
            userInput = false;
            $('#input-button').removeClass('active');
        }else{
            //手書き描写
            canvas.beginPath();
            currentIndex_hand++;
            shapebox_hand.push({ x, y, type: 'touchstart', line: currentIndex_hand });
        }
    }else{
        //消去
        shape_del(x,y,currentShape);
    }
});


//手書きメイン処理
canvasElement.addEventListener('touchmove', function(event) {
    if(!switch_del && isDrawing){
        const offset = this.getBoundingClientRect();
        touch = event.touches[0];
        x = Math.trunc(touch.pageX - offset.left) * ratio;
        y = Math.trunc(touch.pageY - offset.top) * ratio;
        shapebox_hand.push({ x, y, type: 'touchmove', line: currentIndex_hand  });
        handDraw(canvas, x, y);
    }
});


//手書き終了処理
canvasElement.addEventListener('touchend', function(event) {
    if(!switch_del && isDrawing){
        shapebox_hand.push({ type: 'touchend', line: currentIndex_hand  });
        canvas.closePath();
        lastPosition.x = null;
        lastPosition.y = null;
    }
});


//図形描写サブ処理
function drawShape(x,y,kinds_shape){
    canvas.beginPath();
    canvas.lineWidth = 3;
    if (kinds_shape == 1){
        if(lengthRangeNo === 4){
            canvas.arc(x, y, 12, 0, 2 * Math.PI);
        }else{
            canvas.arc(x, y, 9, 0, 2 * Math.PI);
        }
        canvas.stroke();
    }else if(kinds_shape == 2){
        if(lengthRangeNo === 4){
            triangle(canvas,x,y,x+12,y+18,x-12,y+18,"black",canvas.lineWidth);
        }else{
        triangle(canvas,x,y,x+9,y+14,x-9,y+14,"black",canvas.lineWidth);
        }
        canvas.stroke();
    }else if(kinds_shape == 3){
        if(lengthRangeNo === 4){
            cross(canvas,x,y,20,canvas.lineWidth,"black");
        }else{
        cross(canvas,x,y,15,canvas.lineWidth,"black");
        }
        canvas.stroke();
    }else if(kinds_shape == 4){
        square(canvas,x,y,15,15,canvas.lineWidth,"black");
        canvas.stroke();
    }else if(kinds_shape == 5){
        diagonalLine(canvas,x,y,canvas.lineWidth,"black");
        canvas.stroke();
    }else if(kinds_shape == 6){
        canvas.arc(x, y, 11, 0, 2 * Math.PI);
        canvas.fill();
    }else if(kinds_shape == 7){
        triangle(canvas,x,y,x-14,y-17,x+14,y-17,"black",canvas.lineWidth);
        canvas.fill();
    }else if(kinds_shape == 8){
        square(canvas,x,y,15,15,canvas.lineWidth,"black");
        canvas.fill();
    }else if(kinds_shape == 9){
        triangle(canvas,x,y,x+17,y+14,x-17,y+14,"black",canvas.lineWidth);
        canvas.fill();
    }else if(kinds_shape == 10){
        canvas.arc(x, y, 11, 0, 2 * Math.PI,false);
        canvas.stroke();
        canvas.beginPath();
        canvas.arc(x, y, 4, 0, 2 * Math.PI,true);
        canvas.stroke();
    }else if(kinds_shape == 11){
        star(canvas,x,y,18,"black");
        canvas.fill();
    }else if(kinds_shape == 12){
        star(canvas,x,y,15,"black");
        canvas.stroke();
    }else if(kinds_shape == 13){
        other1(canvas,x,y,canvas.lineWidth,"black");
        canvas.stroke();
    }else if(kinds_shape == 14){
        other2(canvas,x,y,6,canvas.lineWidth,"black");
        canvas.stroke();
    }else if(kinds_shape == 15){
        triangle(canvas,x,y,x+17,y+14,x+17,y-14,"black",canvas.lineWidth);
        canvas.fill();
    }
};


// 戻るボタンのクリックイベントの処理
const undoButton = document.getElementById("undo-button");
    undoButton.addEventListener("click", function() {
      if (currentIndex >= 0 && !isDrawing) {
        let shape = shapebox[currentIndex];
        shapes_count(shape.shapes - 1,-1);
        currentIndex--;
        redrawCanvas();
      }else if(currentIndex_hand >= 0 && isDrawing){
        currentIndex_hand--;
        shapebox_hand = shapebox_hand.filter(data => data.line !== currentIndex_hand+1);
        redrawCanvas();
      }
});


//任意の図形del
function shape_del(x,y,kinds_shape){
    if (!isDrawing) {
    //記号の場合
        for (let i = shapebox.length -1 ; i >= 0; i--) {
            let shape = shapebox[i];
            if (x >= shape.x -10 && x <= shape.x + 10 &&
                y >= shape.y -10 && y <= shape.y + 10) {
                shape = shapebox[i];
                shapes_count(shape.shapes - 1,-1);
                shapebox.splice(i,1);
                currentIndex--;
                redrawCanvas();
                break;
            };
        };
    }else{
    //手書き線の場合
        for (let i = shapebox_hand.length -1 ; i >= 0; i--) {
            let data = shapebox_hand[i];
            data.boundingBox = {x: data.x - 20, y: data.y - 20, width: 20, height: 20};
            data.boundingBox.width = data.x - data.boundingBox.x;
            data.boundingBox.height = data.y - data.boundingBox.y;
            if (x >= data.boundingBox.x && x <= data.boundingBox.x + data.boundingBox.width　&&
                y >= data.boundingBox.y && y <= data.boundingBox.y + data.boundingBox.height) {
                const lineToDelete = data.line;
                shapebox_hand = shapebox_hand.filter(data => data.line !== lineToDelete)
                redrawCanvas();
                break;
            }
        }
    };
};


// canvasを再描画(図形)する関数
function redrawCanvas() {
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
    background();
    changeLengthImage();
    if(lengthRangeNo !== 4){
        length_draw();
        shapeRedraw();
        handShapeRedraw();
    };
};
//図形再描写
function shapeRedraw(){
    for (let i = 0; i <= currentIndex; i++) {
        let shape = shapebox[i];
        drawShape(shape.x,shape.y,shape.shapes);
    };
}
//手書き再描写
function handShapeRedraw(){
    for (const data of shapebox_hand){
        if (data.type === 'touchstart') {
            canvas.beginPath();
            canvas.moveTo(data.x, data.y);
        } else if (data.type === 'touchmove') {
            handDraw(canvas, data.x, data.y);
        } else if (data.type === 'touchend') {
            canvas.closePath();
            lastPosition.x = null;
            lastPosition.y = null;
            counter_hand++;
        } else {
            canvasText(canvas, data.type, data.x, data.y);
            counter_hand++;
        }
    };
};


//図形カウント
function shapes_count(kinds,count){
    if (kinds<=2){
    counter[kinds] += count;
    let countdata = document.getElementById(`${kinds+1}`);
    countdata.innerHTML = counter[kinds];
    }
}


//三角図形詳細
function triangle(canvas,x1,y1,x2,y2,x3,y3,color,thick){
    canvas.beginPath();
    canvas.moveTo(x1,y1);
    canvas.lineTo(x2,y2);
    canvas.lineTo(x3,y3);
    canvas.closePath();
    canvas.lineWidth = thick;
    canvas.strokeStyle = color;
};
//バツ図形詳細
function cross(canvas,x,y,size,lineWidth,color){
    canvas.beginPath();
    canvas.moveTo(x - size / 2, y - size / 2);
    canvas.lineTo(x + size / 2, y + size / 2);
    canvas.moveTo(x + size / 2, y - size / 2);
    canvas.lineTo(x - size / 2, y + size / 2);
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = color;
};
//四角図形詳細
function square(canvas,x,y,width,height,lineWidth,color){
    canvas.beginPath();
    canvas.rect(x, y, width, height);
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = color;
};
//ミシン目詳細
function diagonalLine(canvas,x,y,lineWidth,color){
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(x - 10, y + 10);
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = color;
};
//星図形詳細
function star(canvas,cx,cy,r,color){
    let theta = -90;
    let star =[];
    while(star.length < 5){
        const pos = {
            x: r * Math.cos(theta*Math.PI/180) + cx,
            y: r * Math.sin(theta*Math.PI/180) + cy,
        };
        star.push(pos);
        theta += 72;
    }
    canvas.beginPath();
    canvas.fillStyle = color;
    canvas.moveTo(star[0].x, star[0].y);
    canvas.lineTo(star[2].x, star[2].y);
    canvas.lineTo(star[4].x, star[4].y);
    canvas.lineTo(star[1].x, star[1].y);
    canvas.lineTo(star[3].x, star[3].y);
    canvas.closePath();
};
//他1詳細
function other1(canvas,x,y,lineWidth,color){
    canvas.beginPath();
    canvas.moveTo(x - 10, y);
    canvas.lineTo(x - 10, y + 150);
    canvas.moveTo(x, y);
    canvas.lineTo(x - 8, y + 150);
    canvas.moveTo(x + 6, y + 6);
    canvas.lineTo(x + 6 - 8, y + 6 + 150);
    canvas.moveTo(x + 8, y);
    canvas.lineTo(x + 8, y + 150);
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = color;
};
//他2詳細
function other2(canvas,x,y,size,lineWidth,color){
    canvas.beginPath();
    canvas.moveTo(x - size, y);
    canvas.lineTo(x - size, y + size * 27);
    canvas.moveTo(x - size, y);
    canvas.lineTo(x + size, y + size * 27);
    canvas.moveTo(x + size, y);
    canvas.lineTo(x - size, y + size * 27);
    canvas.moveTo(x + size, y);
    canvas.lineTo(x + size * 3, y + size * 27);
    canvas.moveTo(x + size, y + size * 27);
    canvas.lineTo(x + size * 3, y);
    canvas.moveTo(x + size * 3, y);
    canvas.lineTo(x + size * 3, y + size * 27);
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = color;
};
//手書き
function handDraw(canvas,x1,y1){
    canvas.lineCap = "butt";
    canvas.lineWidth = 5;
    canvas.strokeStyle = 'rgba(160,160,160,0.5)';
    if(lastPosition.x === null || lastPosition.y ===null){
        canvas.moveTo(x1, y1);
    }else{
        canvas.moveTo(lastPosition.x, lastPosition.y);
    }
    canvas.lineTo(x1, y1);
    canvas.stroke();
    lastPosition.x = x1;
    lastPosition.y = y1;
    canvas.lineWidth = 1;
    canvas.strokeStyle = "black";
};
//入力ダイアログ表示
function canvasText(canvas,user,x2,y2){
    canvas.font = '33px Arial';
    canvas.fillStyle = 'red';
    canvas.fillText(user,x2 ,y2);
    canvas.fillStyle = 'black';
}


//メモテキストをダイアログ表示で入力できるようにラベルに追加
function memoLevel(){
    let memoUser = window.prompt("入力して下さい。")
    if(memoUser !== "" && memoUser !== null){
        document.getElementById("memo").value = memoUser;
    }
}



//デフォルト日
function defaultDateTime(){
    let now = new Date();
    let yyyy = now.getFullYear();
    let mm = ("0" + (now.getMonth() + 1)).slice(-2);
    let dd = ("0" + now.getDate()).slice(-2);
    let hh = ("0" + now.getHours()).slice(-2);
    let min = ("0" + now.getMinutes()).slice(-2);
    timeData = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    return timeData
}

//ダブルタップで拡大禁止
document.documentElement.addEventListener('dblclick',function(e) {
    e.preventDefault();
});
//ピッチアウト禁止
document.documentElement.addEventListener("touchstart", function(e) {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
  }
}, {passive: false});
document.documentElement.addEventListener("touchmove", function(e) {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
  }
}, {passive: false});


//formデータ送信※追記データあり
function saveDate(){
    let formElement = document.getElementById('myForm');
    let formData = new FormData(formElement);

    let weightValue = formData.get('weight');
    if (weightValue.trim() === ''){
        formData.set('weight', 0.0);
    }

    let checkMan2 = document.getElementById("man2").value;
    let checkSection = '';
    checkMan2 !== '***' && (checkSection = '品保');
    let dataURL = canvasElement.toDataURL('image/jpeg');

    if(formElement.reportValidity()){
        //formデータに変数追加
        formData.append('shape',JSON.stringify(shapebox));
        formData.append('shapeHand',JSON.stringify(shapebox_hand));
        formData.append('shapeCount',JSON.stringify(counter));
        formData.append('lengthRangeNo',JSON.stringify(lengthRangeNo));
        // canvasデータを追加
        checkSection === '品保' && formData.append('image', dataURL);

        event.preventDefault();

        //送信
        fetch('/vi',{
            method: 'POST',
            body:formData})
        .then(res => {
            if(res.status === 200){
                res.text().then(test => console.log('ok'))
                location.reload();
            }else{
                console.log('ng--')}
        })
        .catch(err => console.log("NG"))
    }else{
        return false;
    }
};

//DBから入力LotNoがあるか検索。LotNo有：データをdownload、LotNo空白：リロード
$("#lotno").change(function(){
    const noCheck = document.getElementById("lotno").value;
    console.log(noCheck);
    if(noCheck){
        checkDB(noCheck);
    }else{
        location.reload();
    }
});
async function checkDB(noCheck){
    try {
        const response = await fetch(`/vi?input=${noCheck}`,{
            method: 'GET'
        });
        if (response.ok){
            var viData = await response.json();
            console.log('response-ok',viData);
            var resultData1 = viData.result1;
            var resultData2 = viData.result2;
            if (resultData2.length){
                //データ読み込み※DBにデータがる場合
                //processDay1
                document.getElementById(resultData1[3]).value = resultData2[3];
                //man1
                document.getElementById(resultData1[4]).value = resultData2[4];
                //processDay1
                document.getElementById(resultData1[5]).value = resultData2[5];
                //man2
                document.getElementById(resultData1[6]).value = resultData2[6];
                //kind
                document.getElementById(resultData1[8]).value = resultData2[8];
                //weight
                document.getElementById(resultData1[9]).value = resultData2[9].toFixed(1);
                //length
                document.getElementById(resultData1[10]).value = resultData2[10];
                //loss
                document.getElementById(resultData1[11]).value = resultData2[11];
                //memo
                document.getElementById(resultData1[12]).value = resultData2[12];
                //全長読み込みcanvas描写値
                length_shape = document.getElementById(resultData1[10]).value
                //データ変換
                shapebox = JSON.parse(resultData2[13]);
                shapebox_hand = JSON.parse(resultData2[14]);
                counter = JSON.parse(resultData2[15]);
                //全長レンジ
                if(resultData2[16] === ''){
                    lengthRangeNo = 1;
                }else{
                    lengthRangeNo = resultData2[16];
                }
                //記号全数
                currentIndex = shapebox.length-1;
                //各記号数
                for(let i=0;i<=2;i++){
                    var thisData = document.getElementById(`${i+1}`);
                    thisData.innerHTML = counter[i];
                }
                //手書き数
                var thisData = shapebox_hand.length-1
                if(thisData>=0){
                    currentIndex_hand = shapebox_hand[thisData]["line"];
                }
                //再描写
                redrawCanvas();
            }else{
                //DBにデータがない場合
                document.getElementById(resultData1[10]).value = '';
                document.getElementById(resultData1[11]).value = '';
                length_shape = '';
                shapebox = [];
                shapebox_hand = [];
                counter.fill(0);//0で初期化
                currentIndex = -1;
                currentIndex_hand = -1;
                for(let i=0;i<2;i++){
                    var thisData = document.getElementById(`${i+1}`);
                    thisData.innerHTML = counter[i];}
                redrawCanvas();
            }
        }else{
            console.error('リクエストエラー');
        }
    } catch (error) {
        console.error('error',error);
    }
}

//データ取得
async function showUsers(showData){
    try {
        const response = await fetch(`/vi?input=${showData}`,{
            method: 'GET'
        });
        if (response.ok){
            var viData = await response.json();
            console.log('response-showData-OK',viData);
            var resultData1 = viData.result1;
            var resultData2 = viData.result2;

            let usersTableBody = document.querySelector("#usersTable tbody");
            usersTableBody.innerHTML = ''; // テーブルをクリア
            resultData2.forEach(function(user) {
                let UpData = new Date(user.processDay1)
                let formUpdatedAtData = UpData.getFullYear().toString().substr(-2) + '/' +
                    (UpData.getMonth() + 1) + '/' + UpData.getDate() + ' ' +
                    UpData.getHours() + ':' + String(UpData.getMinutes()).padStart(2, '0');
                let UpData2 = new Date(user.processDay2)
                let formUpdatedAtData2 = UpData2.getFullYear().toString().substr(-2) + '/' +
                    (UpData2.getMonth() + 1) + '/' + UpData2.getDate() + ' ' +
                    UpData2.getHours() + ':' + String(UpData2.getMinutes()).padStart(2, '0');
                let row = '<tr>' +
                    '<td>' + user.id + '</td>' +
                    '<td>' +  formUpdatedAtData + '</td>' +
                    '<td>' +  user.man1 + '</td>' +
                    '<td>' +  (user.processDay2 === "" ? '':formUpdatedAtData2) + '</td>' +
                    '<td>' +  user.man2 + '</td>' +
//                    '<td onclick="lotDatas(\'' + user.lotno + '\')" style="background-color: gray;">' + user.lotno + '</td>' +
                    '<td onclick="lotDatas(\'' + user.lotno + '\')" style="' + (user.man2 === "***" ? 'background-color: yellow;':'background-color: gray;') +'">' + user.lotno + '</td>' +
                    '<td>' + user.kind + '</td>' +
                    '<td>' + (user.weight === 0.0 ? '-':user.weight.toFixed(1)) + '</td>' +
                    '<td>' + user.length + '</td>' +
                    '<td>' + user.loss + '</td>' +
                    '</tr>';
                usersTableBody.innerHTML += row;
                console.log(user.weight);
            });
        }else{
            console.error('リクエストエラー');
        }
    } catch (error) {
        console.error('error',error);
    }
}

//タブ
var tabs = document.querySelectorAll('#tabs a');
var pages = document.querySelectorAll('#tabbody section');
function changeTab() {
    // ▼href属性値から対象のid名を抜き出す
    //var targetid = this.href.substring(this.href.indexOf('#')+1,this.href.length);
    var targetid = this.href.split('#')[1];
    // ▼指定のタブページだけを表示する
    pages.forEach(function(page) {
        page.style.display = page.id === targetid ? "block" : "none";
    });
  // ▼クリックされたタブを前面に表示する
  tabs.forEach(function(tab) {
    tab.style.zIndex = tab === this ? "10" : "0";
  }, this);

  //▼タブ2がクリックされた場合にshowUsers関数を呼び出す/画面固定の切り替え
    if (targetid === 'tab2'){
        showUsers('showData');
        document.body.style.overflow = 'visible';
    }else{
        document.body.style.overflow = 'hidden';
    }

  // ▼ページ遷移しないようにfalseを返す
  return false;
}
// ▼すべてのタブに対して、クリック時にchangeTab関数が実行されるよう指定する
tabs.forEach(function(tab) {
  tab.onclick = changeTab;
});

// ▼最初は先頭のタブを選択
tabs[0].onclick();

//タブ2のデータからlotnoクリック時の処理
function lotDatas(lotData){
    tabs[0].onclick();
    document.getElementById("lotno").value = lotData;
    var event = new Event('change');
    document.getElementById("lotno").dispatchEvent(event);
}


//作業者
function workers(){
    $.ajax({
        url: "/get_workers",
        type: "GET",
        cache: false,
        success: function(data){
            let manList = document.getElementById("man1");
            for(var i=0;i<data.length;i++){
                let opt = document.createElement("option");
                let tempdata = {val:"",txt:data[i]};
                opt.text = tempdata.txt;
                manList.appendChild(opt);
            }
        }
    });
};


//作業者2
function workers2(){
    $.ajax({
        url: "/get_workers2",
        type: "GET",
        cache: false,
        success: function(data){
            let manList = document.getElementById("man2");
            for(var i=0;i<data.length;i++){
                let opt = document.createElement("option");
                let tempdata = {val:"",txt:data[i]};
                opt.text = tempdata.txt;
                manList.appendChild(opt);
            }
        }
    });
};

//日付入力
let kind = document.getElementById("man1");
kind.addEventListener('change', () => {
    document.getElementById("processDay1").value = defaultDateTime();
});

let kind2 = document.getElementById("man2");
kind2.addEventListener('change', () => {
    document.getElementById("processDay2").value = defaultDateTime();
});

(function() {
  'use strict';

  function delegateEvent(selector, type, listener, options) {
    if (options == null) options = false;
    document.addEventListener(type, evt => {
      for (let elem = evt.target; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return listener.call(elem, evt);
      }
    }, options);
  }

  delegateEvent('input', 'keydown', evt => {
    if (evt.key === 'Enter') evt.preventDefault();
  });
}());


//enterキーによるサブミット防止
(function() {
  'use strict';

  function delegateEvent(selector, type, listener, options) {
    if (options == null) options = false;
    document.addEventListener(type, evt => {
      for (let elem = evt.target; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return listener.call(elem, evt);
      }
    }, options);
  }

  delegateEvent('input', 'keydown', evt => {
    if (evt.key === 'Enter') evt.preventDefault();
  });
}());