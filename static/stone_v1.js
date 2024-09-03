
function onClickChange(){

    let check = confirm('砥石交換ですか?　交換の場合はカット数/ドレ数入力していますか？');
    if (check == true){
        let data_list=[];

        let stone_name = prompt('新しい砥石名');
        let cut_count = document.getElementById("cut_count").value;
        let dre_count = document.getElementById("dre_count").value;

        if (stone_name == null) stone_name = '';
        if (cut_count == '') cut_count = 0;
        if (dre_count == '') dre_count = 0;

        data_list.push(stone_name,0,cut_count,dre_count);

        document.getElementById("cut_count").value = "";
        document.getElementById("dre_count").value = "";

        data_list = JSON.stringify(data_list)
        $.ajax({
            type: "POST",
            url: "/stone",
            data: data_list,
            contentType: "application/json",
            success:function(msg) {console.log("success");},
            error: function(msg) {console.log("error");},})


    }

}
