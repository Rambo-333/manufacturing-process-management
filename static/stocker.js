
//ページ設定
// ---------------------------------
//ページ読み込み時に処理
window.onload = () => {

}


document.addEventListener('DOMContentLoaded', function() {
    const leftTable = document.getElementById('leftTable').getElementsByTagName('tbody')[0];
    const rightTable = document.getElementById('rightTable').getElementsByTagName('tbody')[0];

    for (let i = 22; i >= 1; i--) {
        addRow(leftTable, `2-1-${i}`);
        addRow(rightTable, `1-1-${i}`);
    }

    // 棚Noをクリックしたら色を変更または元に戻す
    document.querySelectorAll('td:first-child').forEach(cell => {
        cell.addEventListener('click', function() {
            if (this.style.backgroundColor === 'rgb(255, 204, 0)') { // 色が変更されている場合
                this.style.backgroundColor = ''; // 元の色に戻す
            } else {
                this.style.backgroundColor = '#ffcc00'; // 変更したい色
            }
        });
    });
});

// 画面テーブル表示
function addRow(table, productNo) {
    const newRow = table.insertRow();
    const cell0 = newRow.insertCell(0);
    const cell1 = newRow.insertCell(1);
    const cell2 = newRow.insertCell(2);
    const cell3 = newRow.insertCell(3);
    const cell4 = newRow.insertCell(4);

    const hiddenRows = ['2-1-12', '2-1-11', '2-1-10', '2-1-1']
    if (hiddenRows.includes(productNo)){
        newRow.classList.add('hidden-row');
    }else{
        cell0.innerHTML = productNo;
        cell1.innerHTML = '<input type="text" name="lotNo_${productNo}">';
        cell2.innerHTML = '<input type="text" name="kindName_${productNo}">';
        cell3.innerHTML = `
        <div class="switchArea">
            <input type="checkbox" id="switch_${productNo}">
            <label for="switch_${productNo}"><span></span></label>
            <div id="swImg"></div>
        </div>`;
        cell4.innerHTML = '<textarea name="remarks_${productNo}"></textarea>';
}}


// 入出庫処理コード
// =======================================
import { onClickQR } from './stockerQR.js';

//入庫処理
async function inbound() {
    const rackNo = await inoutbound();
    if (rackNo){
        try{
            const scanText = 'LotNoスキャン';
            const lotData = await onClickQR(scanText);

            console.log(lotData);
            let lotno = ''
            let kind = ''
            const commaIndex = lotData.indexOf(',');
            if (commaIndex !== -1) {
                lotno = lotData.substr(0, commaIndex);
                kind = lotData.substr(commaIndex + 1);
            } else {
                lotno = lotData;
            }
            console.log(lotno, kind);

        } catch(error) {
            console.error('Error reading QR code:', error);
            alert(`中止します。最初からやり直してください.`);
        }
    }
}

//出庫処理
async function outbound(){
    const rackNo = await inoutbound();
    if (rackNo){
        console.log('out');


    }
}
//共通処理
async function inoutbound() {
    window.scrollTo({ top: 0, behavior: 'smooth'});
    try {
        const scanText = '棚Noスキャン';
        const rackNo = await onClickQR(scanText);

        // productNoと一致するか確認
        const allProductNos = Array.from(document.querySelectorAll('td:first-child')).map(td => td.textContent);

        if (allProductNos.includes(rackNo)) {
            console.log(`Rack No ${rackNo} is found in the product list.`);
            return rackNo;
        } else {
            console.log(`Rack No ${rackNo} is not found in the product list.`);
            alert(`棚No ${rackNo} ありません.`);
            return null;
        }

    } catch (error) {
        console.error('Error reading QR code:', error);
        return null;
    }
}

// グローバルスコープに追加
window.inbound = inbound;
window.outbound = outbound;
window.onClickQR = onClickQR;


// データベースからデータ取得
async function showUsers(showData){
    try {
        const response = await fetch(`/cut?input=${showData}`,{
            method: 'GET'
        });
        if (response.ok){
            var viData = await response.json();
            console.log('response-showData-OK',Data);
            var resultData1 = Data.result1;
            var resultData2 = Data.result2;
        }else{
            console.error('リクエストエラー');
        }
    } catch (error) {
        console.error('error',error);
    }
}








// //DB操作
// // ---------------------------------
// //formデータ送信
// function saveDate(){
//     let formData = document.getElementById('myForm');
//     if(formElement.reportValidity()){
//         event.preventDefault();
//         //送信
//         fetch('/vad_ins',{
//             method: 'POST',
//             body:formData})
//         .then(res => {
//             if(res.status === 200){
//                 res.text().then(test => console.log('ok'))
//                 location.reload();
//             }else{
//                 console.log('ng--')}
//         })
//         .catch(err => console.log("NG"))
//     }else{
//         return false;
//     }
// };

// //DBから入力LotNoがあるか検索。LotNo有：データをdownload
// $("#lotno").change(function(){
//     const noCheck = document.getElementById("lotno").value;
//     if(noCheck){
//         checkDB(noCheck);
//     }else{
//         location.reload();
//     }
// });
// async function checkDB(noCheck){
//     try {
//         const response = await fetch(`/vad_ins?input=${noCheck}`,{
//             method: 'GET'
//         });
//         if (response.ok){
//             var lotDatas = await response.json();
//             console.log('response-ok',lotDatas);
//             var resultData1 = lotDatas.result1;
//             var resultData2 = lotDatas.result2;
//             if (resultData2.length){
//                 //データ読み込み※DBにデータがる場合
//                 for (let i=5 ; i < resultData1.length ; i++){
//                     document.getElementById(resultData1[i]).value = resultData2[i];
//                 }
//             }
//         }else{
//             console.error('リクエストエラー');
//         }
//     } catch (error) {
//         console.error('error',error);
//     }
// }

// //データ取得
// async function showUsers(showData){
//     try {
//         const response = await fetch(`/vad_ins?input=${showData}`,{
//             method: 'GET'
//         });
//         if (response.ok){
//             var viData = await response.json();
//             console.log('response-showData-OK',viData);
//             var resultData1 = viData.result1;
//             var resultData2 = viData.result2;

//             let usersTableBody = document.querySelector("#usersTable tbody");
//             usersTableBody.innerHTML = ''; // テーブルをクリア
//             resultData2.forEach(function(user) {
//                 let UpData = new Date(user.processDay)
//                 let formUpdatedAtData = UpData.getFullYear().toString().substr(-2) + '/' +
//                     (UpData.getMonth() + 1) + '/' + UpData.getDate() + ' ' +
//                     UpData.getHours() + ':' + String(UpData.getMinutes()).padStart(2, '0');
//                 let row = '<tr>' +
//                     '<td>' + user.id + '</td>' +
//                     '<td>' +  formUpdatedAtData + '</td>' +
//                     '<td>' +  user.man + '</td>' +
//                     '<td onclick="lotDatas(\'' + user.lotno + '\')" style="background-color: gray;">' + user.lotno + '</td>' +
//                     '<td>' + user.kind + '</td>' +
//                     '<td>' + user.length + '</td>' +
//                     '<td>' + user.weight + '</td>' +
//                     '<td>' + user.Min_OD + '</td>' +
//                     '<td>' + user.Max_OD + '</td>' +
//                     '<td>' + user.memo + '</td>' +
//                     '</tr>';
//                 usersTableBody.innerHTML += row;
//             });
//         }else{
//             console.error('リクエストエラー');
//         }
//     } catch (error) {
//         console.error('error',error);
//     }
// }




//操作設定
// ---------------------------------
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

    //ダブルタップで拡大禁止
    document.documentElement.addEventListener('dblclick',function(e) {
        e.preventDefault();
    });

