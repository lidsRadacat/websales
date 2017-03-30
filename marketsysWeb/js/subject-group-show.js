var transSubjectGroupId = sessionStorage.getItem("transSubjectGroupId");

/* 给 查看详情 按钮绑定单击事件，显示详细信息 */
$("#tbody").on("click","tr>td:last-child>a[title='查看详情']",function(){
    var parent = this.parentNode;
    var grandParent = parent.parentNode;
    var children = grandParent.children[2];
    var transSubjectGroupId = children.innerHTML;
    sessionStorage.setItem("transSubjectGroupId",transSubjectGroupId);  //要传到后台的编号transSubjectGroupId
});
/* 异步请求群详细信息 */
$.ajax({
    type:"GET",
    url:"http://" + ip + "/bcat/thematicGroup/groupDetail.do?Id=" + transSubjectGroupId + "&jsonp=?",
    dataType:"jsonp",  //数据类型为jsonp
    success:function(datalist){
        //console.log(datalist);
        var html = "";
        //群状态 数字 转 汉字
        var status = getStatus(datalist.result.groupStatus);
        html += `
            <tr>
                <th class="text-r" width="80">群ID：</th>
                <!--<td>transSubjectGroupId</td>-->
                <td>${datalist.result.thematicGroupId}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群名称：</th>
                <td>${datalist.result.tgName}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群描述：</th>
                <td>${datalist.result.tgDescribe}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群公告：</th>
                <td>${datalist.result.tgAnnouncement}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群状态：</th>
                <td>${status}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">注册时间：</th>
                <td>${datalist.result.tgCreateTime}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="80">修改时间：</th>
                <td>${datalist.result.tgModify}</td>
                <!--todo需要修改-->
            </tr>
        `;
        $("#outer_tbody").html(html);
        $("#groupname").html(datalist.result.tgName);  //群名称
        $("#signature").html(datalist.result.tgDescribe);  //群描述
        //todo：群头像
    }
});

/* 群状态 */
function getStatus(statusNum){
    if(statusNum === "0"){
        return "正常";
    }
    else if(statusNum === "1"){
        return "禁用";
    }
}