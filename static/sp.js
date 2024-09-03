
//プルダウンリスト　研削量
const list = [
    {val:"",txt:"-"},
    {val:99,txt:"再ﾄﾗ"},
    {val:0.3,txt:"ﾄﾗﾊﾞｰｽ"},
    {val:0.5,txt:"0.5"},
    {val:1.0,txt:"1.0"},
    {val:1.5,txt:"1.5"},
    {val:2.0,txt:"2.0"},
    {val:2.5,txt:"2.5"},
    {val:3.0,txt:"3.0"},
    {val:3.5,txt:"3.5"},]
//一括プルダウン処理
function applyCommonList(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        pullDownRun(elements[i]);
    }
}
//個別プルダウン処理
function pullDownRun(tmp){
    for(var i=0;i<list.length;i++){
        let opt = document.createElement("option");
        opt.value = list[i].val;
        opt.text = list[i].txt;
        tmp.appendChild(opt);}
}


//作業者
function workers(manList){
    $.ajax({
        url: "/get_workers",
        type: "GET",
        cache: false,
        success: function(data){
            for(var i=0;i<data.length;i++){
                let opt = document.createElement("option");
                tempdata={val:"",txt:data[i]};
                opt.text = tempdata.txt;
                manList.appendChild(opt);
            }
        }
    });
    }


//ページ読み込み時に処理
//=================================>
window.onload = () => {
    //プルダウンリスト設定
    applyCommonList("ground");
    //作業者
    let manList = document.getElementById("manSet");
    workers(manList);
    manList = document.getElementById("manRe");
    workers(manList);
}
//=================================>


//現在日時
//=================================>
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
// ラベルをクリックしたときの処理1
document.querySelector("label[for='processDaySet']").addEventListener("click", () => {
  // 現在の日時を取得
  document.getElementById("processDaySet").value = defaultDateTime();
});
// ラベルをクリックしたときの処理2
document.querySelector("label[for='processDayRe']").addEventListener("click", () => {
  // 現在の日時を取得
  document.getElementById("processDayRe").value = defaultDateTime();
});
//=================================>


//共通変数
let pgNo1 = document.getElementById("pgNo1");
let pgNo2 = document.getElementById("pgNo2");
let Target1 = document.getElementById("short");
let Target2 = document.getElementById("collection");
let Target3 = document.getElementById("MMs");
let Target4 = document.getElementById("startX");
let spNo = document.getElementById("spNo");

//号機によりラベル名の切り替え
//=================================>
spNo.addEventListener('change', () => {
    spNo = document.getElementById("spNo").value;
    spNoChange(spNo);
    //一時入力の有無確認
    if(spNo==''){
        location.reload();
    }else{
        checkDB(spNo);
    }
});

function spNoChange(spNo){
    if(spNo==1){
        pgNo1.disabled = true;
        pgNo2.disabled = false;
        pgNo2.checked = true;
        pgNoChange();
        calculate();
    }else{
        pgNo1.disabled = false;
        pgNo2.disabled = false;
        pgNo1.checked = true;
        pgNoChange();
        calculate();
    }
}
//=================================>

//プログラムにより入力制限切り替え
//=================================>
function pgNoChange(){
    let spNo = document.getElementById("spNo").value * 1;
    if(pgNo2.checked){
        Target1.disabled = true;
        Target1.required = false;
        Target2.disabled = true;
        Target2.required = false;
        Target3.disabled = true;
        Target3.required = false;
        Target4.disabled = true;
    }else if(pgNo1.checked){
        Target1.disabled = false;
        Target1.required = true;
        Target2.disabled = false;
        Target2.required = true;
        Target3.disabled = false;
        Target3.required = true;
        Target4.disabled = false;
    }
}

pgNo1.addEventListener('change',pgNoChange);
pgNo2.addEventListener('change',pgNoChange);
//=================================>

//計算_Auto
//=================================>
function calculate(){
    let x502 = document.getElementById("maxValue").value * 1;
    let x503 = document.getElementById("minValue").value * 1;
    let x504 = document.getElementById("short").value * 1;
    let x505 = document.getElementById("collection").value * 1;
    let x506 = document.getElementById("MMs").value * 1;
    let spNo = document.getElementById("spNo").value * 1;
    let pgNo = document.getElementById("pgNo1").checked;
    let offset = 9.6;
    if(spNo==3){offset=6.5;}

    if(spNo>1 && pgNo && x502!==0 && x503!==0 && x504!==0 && x505!==0 && x506!==0){
        let x101 = (x504 - x502 - offset + x505 - 1.0) * 2.32;
        let x102 = (x502-x503)*2.32;
        let x103 = Math.trunc(x102/3.5);
        document.getElementById("startX").value = Math.trunc((x506-x101) * 10) / 10;
        document.getElementById("number").value = x103+1;
        document.getElementById("ground1").value = Math.trunc(x102 * 10 ) / 10;
        document.getElementById("coordinate1").value = Math.trunc((x506-x101-x102) * 10) / 10;
    }else if(spNo>1 && pgNo == false && x502!==0 && x503!==0){
        let x101 = Math.trunc((x502-x503)/3.5);
        let x102 = x101*3.5;
        let x103 = x502-x102;
        document.getElementById("number").value = x101;
        document.getElementById("ground1").value = x102;
        document.getElementById("coordinate1").value = x103;
    }else if(spNo==1 && pgNo == false && x502!==0 && x503!==0){
        let x101 = Math.trunc((x502-x503-1.5)/3.5);
        let x102 = x101*3.5+1.5;
        let x103 = x502-x102;
        document.getElementById("number").value = x101;
        document.getElementById("ground1").value = x102;
        document.getElementById("coordinate1").value = x103;
    }else{
        //処理なし
    }
}
//=================================>

//計算_Single
//=================================>
function calculate_Single(idNo){
    let coordinate = document.getElementById(`coordinate${idNo-1}`).value * 1;
    let ground = document.getElementById(`ground${idNo}`).value * 1;
    let spNo = document.getElementById("spNo").value * 1;
    if(ground===0.3 && spNo !== 1){
        ground=0.8;
    }else if(ground===99){
        ground=prompt();
    }
    if(coordinate !== 0){
        document.getElementById(`coordinate${idNo}`).value = Math.trunc((coordinate*10-ground*10))/10;
    }
    tempSave();
}
//=================================>

//マイナス入力
function minusAdd(){
    document.getElementById("minValue").value = "-";
    document.getElementById("minValue").focus();
}


//一時データ送信
function tempSave(){
    let spNo = document.getElementById("spNo").value;
    let formElement = document.getElementById('myForm');
    let formData = new FormData(formElement);
    let sectionValues = document.getElementById('face');
    let editFace = '';
    for (let i=0;i<sectionValues.length;i++){
        if (sectionValues[i].selected){
        editFace += sectionValues[i].value;
        }
    }
    formData.append('face', editFace);
    if(spNo !==''){
        tempSaveRun(spNo, formData);
    }else{
        alert('号機は必ず入力してください');
    }
}

async function tempSaveRun(spNo, formData){
    try {
        const response = await fetch(`/sp?spNo=${spNo}`,{
            method: 'POST',
            body:formData
        });
        if (response.ok){
            alert('一時保存完了');
            location.reload();
            console.log('response-ok');
        }else{
            console.error('リクエストエラー:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('ネットワークエラー:', error);
    }
}


//formデータ送信
function saveDate(){
    let formElement = document.getElementById('myForm');
    let formData = new FormData(formElement);
    let sectionValues = document.getElementById('face');
    let editFace = '';
    for (let i=0;i<sectionValues.length;i++){
        if (sectionValues[i].selected){
        editFace += sectionValues[i].value;
        }
    }
    formData.append('face', editFace);

    if(formElement.reportValidity()){
        event.preventDefault();
        //送信
        fetch('/sp',{
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

//一時保存データがあるか確認
async function checkDB(spNo){
    try {
        const response = await fetch(`/sp?input=${spNo}`,{
            method: 'GET'
        });
        if (response.ok){
            let lotDatas = await response.json();
            console.log('response-ok',lotDatas);
            let resultData1 = lotDatas.result1;
            let resultData2 = lotDatas.result2;
            let checkNo = resultData2[8];

            //データセット
            //---------------------------------
            for (let i=3 ; i < resultData1.length ; i++){
                if (i==8){
                    //号機はすでに選択済のため、pass
                }else if (i==9){
                    //プログラムNo洗濯
                    if(resultData2[i] == 'O20'){
                        pgNo1.disabled = true;
                        pgNo2.disabled = false;
                        pgNo2.checked = true;
                    }else{
                        pgNo1.disabled = false;
                        pgNo2.disabled = true;
                        pgNo1.checked = true;
                    }
                }else if (i==14){
                    //面選択
                    let select = document.getElementById('face');
                    for (let i=0;i<select.length;i++){
                        select.options[i].selected  = false;
                    }
                    if(resultData2[i]!== null){
                        let chair = resultData2[i]
                        for (let i=0;i<select.length;i++){
                            if(chair.includes(select.options[i].value)){
                                select.options[i].selected  = true;
                            }
                        }
                    }
                }else{
                    document.getElementById(resultData1[i]).value = resultData2[i];
                }
            }
            pgNoChange()
            //---------------------------------

            if(checkNo===null){
                spNoChange(spNo);
                alert('新規');
            }else{
                alert('加工中');
            }

        }else{
            console.error('リクエストエラー:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('error',error);
    }
}

//データ取得
async function showUsers(showData){
    try {
        const response = await fetch(`/sp?input=${showData}`,{
            method: 'GET'
        });
        if (response.ok){
            const spData = await response.json();
            console.log('response-showData-OK',spData);
            const resultData1 = spData.result1;
            const resultData2 = spData.result2;

            //テーブル項目
            let usersTableHeader = document.querySelector("#usersTable thead");
            usersTableHeader.innerHTML = ''; // テーブルをクリア
            let dataRows = '';
            dataRow = '<tr>';
            resultData1.forEach(columnName => {
                if (columnName !=='created_at' && columnName !=='updated_at'){
                    dataRow += `<th>${columnName}</th>`;
                }
            });
            dataRow += '</tr>';
            usersTableHeader.innerHTML += dataRow;

            //テーブルデータ
            let usersTableBody = document.querySelector("#usersTable tbody");
            usersTableBody.innerHTML = ''; // テーブルをクリア
            dataRows = '';
            resultData2.forEach(function(user) {
                dataRow = '<tr>';
                resultData1.forEach(columnName => {
                    if (columnName =='processDaySet' || columnName =='processDayRe'){
                        let UpData = new Date(user[columnName]);
                        user[columnName] = UpData.getFullYear().toString().substr(-2) + '/' +
                        (UpData.getMonth() + 1) + '/' + UpData.getDate() + ' ' +
                        UpData.getHours() + ':' + String(UpData.getMinutes()).padStart(2, '0');
                    }
                    if (columnName === 'ODave' && user[columnName]>3){
                        dataRow += `<td onclick="showUsers2(\'${user['id']}\')">${user[columnName]}</td>`;
                    }else if (columnName !=='created_at' && columnName !=='updated_at'){
                        dataRow += `<td>${(user[columnName] === undefined ? '':user[columnName])}</td>`;
                    }
                });
                dataRow += '</tr>';
                usersTableBody.innerHTML += dataRow;
            });

        }else{
            console.error('リクエストエラー');
        }
    } catch (error) {
        console.error('error',error);
    }
}


//データ取得(1本の詳細）
async function showUsers2(oneData){
    try {
        const response = await fetch(`/sp?input=${oneData}`,{
            method: 'GET'
        });
        if (response.ok){
            const spData = await response.json();
            console.log('response-showData-OK',spData);
            const resultData1 = spData.result1;
            const resultData2 = spData.result2;
            //テーブル項目
            let usersTableHeader = document.querySelector("#usersTable2 thead");
            usersTableHeader.innerHTML = ''; // テーブルをクリア
            let dataRows = '';
            dataRow = '<tr>';
                dataRow += `<th onclick="del_showUsers2()">回数</th>`;
                dataRow += `<th>座標値</th>`;
                dataRow += `<th>OD</th>`;
            dataRow += '</tr>';
            usersTableHeader.innerHTML += dataRow;

            //テーブルデータ
            let usersTableBody = document.querySelector("#usersTable2 tbody");
            usersTableBody.innerHTML = ''; // テーブルをクリア
            dataRows = '';
            for (let i=0;i < resultData1.length;i++){
                dataRow = '<tr>';
                    dataRow += `<td>${i+1}</td>`;
                    dataRow += `<td>${(resultData1[i] === undefined ? '':resultData1[i])}</td>`;
                    dataRow += `<td>${(resultData2[i] === null ? '':resultData2[i])}</td>`;
                dataRow += '</tr>';
                usersTableBody.innerHTML += dataRow;
            }
        }else{
            console.error('リクエストエラー');
        }
    } catch (error) {
        console.error('error',error);
    }
}


function del_showUsers2(){
    //テーブル項目
    let usersTableHeader = document.querySelector("#usersTable2 thead");
    usersTableHeader.innerHTML = ''; // テーブルをクリア
    //テーブルデータ
    let usersTableBody = document.querySelector("#usersTable2 tbody");
    usersTableBody.innerHTML = ''; // テーブルをクリア
}

//タブ
//=================================>
//var tabs = document.getElementById('tabs').getElementsByTagName('a');
//var pages = document.getElementById('tabbody').getElementsByTagName('section');
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
//=================================>


//ダブルタップで拡大禁止
document.documentElement.addEventListener('dblclick',function(e) {
    e.preventDefault();
});

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