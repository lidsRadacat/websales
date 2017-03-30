var pageNum = 1;  //保存当前正在浏览的页数
var transPrivateDetailId = sessionStorage.getItem("transPrivateDetailId");

//异步请求私信详细信息
$.ajax({
    type:"GET",
    //async:false,
    url:"http://" + ip + "/bcat/privateLette/oneLette.do?Id=" + transPrivateDetailId + "&jsonp=?",
    dataType:"jsonp",
    success:function(datalist){
        var html = "";
        //状态 数字 转 汉字
        var status = getStatus(datalist.result.plStatus);
        //类型 数字 转 汉字
        var type = getType(datalist.result.type);
        html += `
            <tr>
                <th class="text-r" width="100">发送者嗒嗒ID：</th>
                <td>${datalist.result.plPid}</td>
            </tr>
            <tr>
                <th class="text-r" width="100">接收者嗒嗒ID：</th>
                <td>${datalist.result.toPid}</td>
            </tr>
            <tr>
                <th class="text-r" width="100">私信类型：</th>
                <td>${type}</td>
            </tr>
            <tr>
                <th class="text-r" width="100">发送时间：</th>
                <td>${datalist.result.plCreateTime}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="100">修改时间：</th>
                <td>${datalist.result.plModify}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="100">消息状态：</th>
                <td>${status}</td>
            </tr>
        `;
        $("#outer_tbody").html(html);  //私信详细信息
    }
});

/* 私信状态 */
function getStatus(statusNum){
    if(statusNum === "0"){
        return "未读";
    }
    else if(statusNum === "1"){
        return "已读";
    }
}
/* 私信类型 */
function getType(typeNum){
    if(typeNum === "1"){
        return "文本";
    }
    else if(typeNum === "2"){
        return "语音";
    }
    else if(typeNum === "3"){
        return "图片";
    }
}
