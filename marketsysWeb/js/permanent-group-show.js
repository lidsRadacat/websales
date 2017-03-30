var transPermanentGroupId = sessionStorage.getItem("transPermanentGroupId");

/* 给 查看详情 按钮绑定单击事件，显示详细信息 */
$("#tbody").on("click","tr>td:last-child>a[title='查看详情']",function(){
    var parent = this.parentNode;
    var grandParent = parent.parentNode;
    var children = grandParent.children[2];
    var transPermanentGroupId = children.innerHTML;
    sessionStorage.setItem("transPermanentGroupId",transPermanentGroupId);  //要传到后台的编号transPermanentGroupId
});
/* 异步请求群详细信息 */
$.ajax({
    type:"GET",
    url:"http://" + ip + "/bcat/permanentGroup/groupDetail.do?Id=" + transPermanentGroupId + "&jsonp=?",
    dataType:"jsonp",  //数据类型为jsonp
    success:function(datalist){
        var html = "";
        var s_html = "";  //用于放群成员
        $.each(datalist.result.users,function(i,value){  //遍历群成员
            s_html += `
                <tr>
                    <td>昵称：${value.nickname}</td>
                    <td>嗒嗒ID：${value.pid}</td>
                </tr>
            `;
        });
        //群状态 数字 转 汉字
        var status = getStatus(datalist.result.pgStatus);
        html += `
            <tr>
                <th class="text-r" width="80">群ID：</th>
                <!--<td>transSubjectGroupId</td>-->
                <td>${datalist.result.permanentGroupId}</td>
            </tr>
            <tr>
                <th class="text-r" width="100">创建人嗒嗒ID：</th>
                <!--<td>transSubjectGroupId</td>-->
                <td>${datalist.result.pgPid}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群名称：</th>
                <td>${datalist.result.pgName}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群描述：</th>
                <td>${datalist.result.pgDescribe}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群公告：</th>
                <td>${datalist.result.pgAnnouncement}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群地址：</th>
                <td>${datalist.result.pgAddress}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">经度：</th>
                <td>${datalist.result.pgLongitude}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">纬度：</th>
                <td>${datalist.result.pgLatitude}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">创建时间：</th>
                <td>${datalist.result.pgCreateTime}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="80">群状态：</th>
                <td>${status}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">群成员：</th>
                <td></td>
            </tr>
            <tr>
                <th class="text-r" width="80"></th>
                <td><table>${s_html}</table></td>
            </tr>
        `;
        $("#outer_tbody").html(html);
        $("#groupname").html(datalist.result.pgName);  //群名称
        $("#signature").html(datalist.result.pgDescribe);  //群描述
        //todo：群头像datalist.result.pgAvatar
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