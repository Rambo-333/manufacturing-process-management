
//プルダウンリスト　上部下部兼用
const list = [
    {val:"",txt:"--選択--"},
    {val:"追加.サンプル",txt:"追加.サンプル"},
    {val:"追加.内面欠陥(泡、アバタ)",txt:"追加.内面欠陥(アバタ..)"},
    {val:"追加.内外面欠陥(削残、開放泡)",txt:"追加.内外面欠陥(削残..)"},
    {val:"追加.内外面異常(クラック、カケ)",txt:"追加.内外面異常(カケ..)"},
    {val:"追加.その他",txt:"追加.その他"},
    {val:"",txt:"------"},
    {val:"分割.工程",txt:"分割.分割工程"},
    {val:"分割.サンプル",txt:"分割.サンプル"},
    {val:"分割.内面欠陥(泡、アバタ)",txt:"分割.内面欠陥(アバタ..)"},
    {val:"分割.内外面欠陥(削残、開放泡)",txt:"分割.内外面欠陥(削残..)"},
    {val:"分割.内外面異常(クラック、カケ)",txt:"分割.内外面異常(カケ..)"},
    {val:"分割.その他",txt:"分割.その他"},]

//ページ読み込み時に処理
window.onload = () => {
    //ドロップダウンリスト
    let tmp = document.getElementById("cutList");
    pullDownRun(tmp);
    //作業者
    workers();
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

//プルダウン処理
function pullDownRun(tmp){
    for(var i=0;i<list.length;i++){
        let opt = document.createElement("option");
        opt.value = list[i].val;
        opt.text = list[i].txt;
        tmp.appendChild(opt);}}

//作業者
function workers(){
    $.ajax({
        url: "/get_workers",
        type: "GET",
        cache: false,
        success: function(data){
            let manList = document.getElementById("man");
            for(var i=0;i<data.length;i++){
                let opt = document.createElement("option");
                tempdata={val:"",txt:data[i]};
                opt.text = tempdata.txt;
                manList.appendChild(opt);
            }
        }
    });
}

//日付入力
let manChange = document.getElementById("man");
manChange.addEventListener('change', () => {
    document.getElementById("processDay").value = defaultDateTime();
});


//ダブルタップで拡大禁止
document.documentElement.addEventListener('dblclick',function(e) {
    e.preventDefault();
});


//formデータ送信
function saveDate(){
    let formElement = document.getElementById('myForm');
    let formData = new FormData(formElement);
    let addUpdateDate = document.getElementById("update").textContent;
    formData.append('addUpdateDate',addUpdateDate);

    if(formElement.reportValidity()){
        event.preventDefault();
        //送信
        fetch('/add_cut',{
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

//DBから入力LotNoがあるか検索。LotNo有：データをdownload
//$("#lotno").change(function(){
//    const noCheck = document.getElementById("lotno").value;
//    if(noCheck){
//        checkDB(noCheck);
//    }else{
//        location.reload();
//    }
//});
//DATAのlotnoクリック時にdata呼び出し

async function checkDB(noCheck){
    try {
        const response = await fetch(`/add_cut?input=${noCheck}`,{
            method: 'GET'
        });
        if (response.ok){
            var lotDatas = await response.json();
            console.log('response-ok',lotDatas);
            var resultData1 = lotDatas.result1;
            var resultData2 = lotDatas.result2;
            if (resultData2.length){
                //データ読み込み※DBにデータがる場合
                for (let i=3 ; i < resultData1.length ; i++){
                    document.getElementById(resultData1[i]).value = resultData2[i];
                }
                //編集の場合は日付をクリアし、編集日時にする。
                //※データ移行後の修正が必要なため
                document.getElementById("processDay").value = '';
                //品種イベント発火させる
                var event = new Event('change');
                document.getElementById("kind").dispatchEvent(event);
                document.getElementById("update").textContent = noCheck;
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
        const response = await fetch(`/add_cut?input=${showData}`,{
            method: 'GET'
        });
        if (response.ok){
            var addCutData = await response.json();
            console.log('response-showData-OK',addCutData);
            var resultData1 = addCutData.result1;
            var resultData2 = addCutData.result2;

            let usersTableBody = document.querySelector("#usersTable tbody");
            usersTableBody.innerHTML = ''; // テーブルをクリア
            resultData2.forEach(function(user) {
                let UpData = new Date(user.processDay)
                let formUpdatedAtData = UpData.getFullYear().toString().substr(-2) + '/' +
                    (UpData.getMonth() + 1) + '/' + UpData.getDate() + ' ' +
                    UpData.getHours() + ':' + String(UpData.getMinutes()).padStart(2, '0');
                let row = '<tr>' +
                    '<td>' + user.id + '</td>' +
                    '<td>' +  formUpdatedAtData + '</td>' +
                    '<td>' +  user.man + '</td>' +
                    '<td onclick="lotDatas(\'' + user.id + '\')" style="background-color: gray;">' + user.lotno + '</td>' +
                    '<td>' + user.kind + '</td>' +
                    '<td>' + user.cutList + '</td>' +
                    '<td>' + (user.memo === null ? '':user.memo) + '</td>' +
                    '</tr>';
                usersTableBody.innerHTML += row;
            });
        }else{
            console.error('リクエストエラー');
        }
    } catch (error) {
        console.error('error',error);
    }
}


//品種により入力制限切り替え
let kind = document.getElementById("kind");
kind.addEventListener('change', () => {
    let cutList = document.getElementById("cutList");
    let cutReason = cutList.value.charAt(0);
    if (cutReason){
        var event = new Event('change');
        cutList.dispatchEvent(event);
    }
});

//理由により入力制限切り替え
let cutList = document.getElementById("cutList");
cutList.addEventListener('change', () => {
    let kindTop = kind.value.charAt(0);
    let cutReason = cutList.value.charAt(0);

    setAttributes(".infoSplit", cutReason !== "追");
    setAttributes(".infoAdd", cutReason === "追");

    if (cutReason !== "追"){
        setAttributes(".infoSplit .ovd", kindTop !== "R");
        setAttributes(".infoSplit .vad", kindTop === "R");
    }else{
        setAttributes(".infoAdd .ovd", kindTop !== "R");
        setAttributes(".infoAdd .vad", kindTop === "R");
    }
});
function setAttributes(className, isEnabled) {
    let divs = document.querySelectorAll(className)
    divs.forEach(div => {
        let elements = div.querySelectorAll('input, select');
        elements.forEach(element => {
            element.disabled = !isEnabled;
        });
    });
}



//タブ
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
//    document.getElementById("lotno").value = lotData;
    checkDB(lotData);
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