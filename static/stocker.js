
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
});

function addRow(table, productNo) {
    const newRow = table.insertRow();

    const cell0 = newRow.insertCell(0);
    const cell1 = newRow.insertCell(1);
    const cell2 = newRow.insertCell(2);
    const cell3 = newRow.insertCell(3);
    const cell4 = newRow.insertCell(4);
    const cell5 = newRow.insertCell(5);

    cell0.innerHTML = '<input type="radio" name="check">';;
    cell1.innerHTML = productNo;
    // cell1.innerHTML = `<input type="text" name="productNo" value="${productNo}">`;
    cell2.innerHTML = '<input type="text" name="lotNo" readonly>';
    cell3.innerHTML = '<input type="text" name="productName" readonly>';
    cell4.innerHTML = '<input type="number" name="quantity" readonly>';
    cell5.innerHTML = '<input type="text" name="remarks" readonly>';
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

