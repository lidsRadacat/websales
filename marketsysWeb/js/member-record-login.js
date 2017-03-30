var pageNum = 1;  //保存当前正在浏览的页数
var transPidsArr = [];  //保存批量删除值transPids

/* 异步请求用户登录记录 */
function getUserLoginStatus(){
    $.ajax({
        type:"GET",
        url:"http://" + ip + "/bcat/loginInfo/loginPage.do?pageNo=" + pageNum + "&jsonp=?",
        dataType:"jsonp",
        success:function(datalist){
            var html = "";
            sessionStorage.setItem("totalPage",datalist.result.totalPage);  //保存总页数到本地
            $.each(datalist.result.loginList,function(i,value){
                //序号 字符串 转 数字
                var pageNo = parseInt(datalist.result.pageNo);
                var iNum = parseInt(i);
                html += `
                    <tr class="text-c">
                        <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.loginId}" /></td>
                        <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                        <td data-id="dadaID">${value.lPid}</td>
                        <td>${value.loginIp}</td>  <!-- IP需要修改 -->
                        <td>${value.loginDevice}</td>  <!-- 设备需要修改 -->
                        <td>${value.loginTime}</td>  <!-- 登录时间需要修改 -->
                        <td>${value.quitTime}</td>  <!-- 退出时间需要修改 -->
                        <td class="f-14" data-transId="${value.loginId}">
                            <a title="删除" href="javascript:;" onclick="member_del(this,sessionStorage.getItem('transLoginId'))" class="ml-5" style="text-decoration:none">
                                <i class="Hui-iconfont">&#xe6e2;</i>
                            </a>
                        </td>
                    </tr>
                `;
                /* 每页显示的首位编号 */
                $("#DataTables_Table_0_info span:first-child").html((pageNo - 2) * 10 + iNum + 2);
                $("#DataTables_Table_0_info span:last-child").html((pageNo - 2) * 10 + iNum + 11);
            });
            $("#tbody").html(html);
            /* 用户上传好友总数量 */
            $("#totalRecord").html(datalist.result.totalRecord);
            //每拉取一次数据，使全选框处于非选中状态
            var chbAll = document.querySelector("#thead>tr>th>input[type='checkbox']");
            chbAll.checked = false;
        }
    });
}
getUserLoginStatus();

/* 上/下一页操作 */
var previous = document.getElementById("DataTables_Table_0_previous");
previous.onclick = function(){
    next.style.opacity = "1";
    if(pageNum > 1){
        pageNum--;
        previous.style.opacity = "1";
        getUserLoginStatus();
        $("#DataTables_Table_0_paginate>span>a").html(pageNum);  //改变显示页码
        if(pageNum == 1){
            previous.style.opacity = "0";
        }
    }
}
var next = document.getElementById("DataTables_Table_0_next");
var totalPage = sessionStorage.getItem("totalPage");  //获得总页数
next.onclick = function(){
    previous.style.opacity = "1";
    if(pageNum < totalPage){
        pageNum++;
        next.style.opacity = "1";
        getUserLoginStatus();
        $("#DataTables_Table_0_paginate>span>a").html(pageNum);  //改变显示页码
        if(pageNum == totalPage){
            next.style.opacity = "0";
        }
    }
}

/* 给 删除 按钮绑定单击事件，告诉后台成功删除*/
$("#tbody").on("click","tr>td:last-child>a[title='删除']",function(){
    var parent = this.parentNode;
    //var grandParent = parent.parentNode;
    var transLoginId = parent.getAttribute("data-transId");  //要传到后台的 删除 的编号transLoginId
    sessionStorage.setItem("transLoginId",transLoginId);
    member_del(this,sessionStorage.getItem("transLoginId"));
});
/* 用户 - 删除 */
function member_del(obj,id){
    layer.confirm('确认要删除吗？',function(index){
        /* 异步请求删除数据 */
        $.ajax({
            type: "POST",
            url: "http://" + ip + "/bcat/loginInfo/removeInfo.do?jsonp=?",
            data: {Id:sessionStorage.getItem("transLoginId")},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!',{icon:1,time:1000});
                    getUserLoginStatus();
                }
                else{
                    layer.msg('删除失败!',{icon:1,time:1000});
                }
            }
        });
    });
}

/* 全选框 事件 */
function checkAll(chb){
    //查找table下的tbody下的每行第一个td中的input，保存在chbs中
    var chbs = document.querySelectorAll("#tbody>tr>td:first-child>input[type='checkbox']");
    //遍历chbs中每个chb
    for(var i = 0;i < chbs.length;i++){
        //设置当前chb的checked等于chb的checked
        chbs[i].checked = chb.checked;
    }
}
function checkSel(chb){
    //查找thead中tr下的th中的input，保存在变量chbAll中
    var chbAll = document.querySelector("#thead>tr>th>input[type='checkbox']");
    //如果chb的checked为false，设置chbAll的checked为false
    if(chb.checked === false){
        chbAll.checked = false;
    }//否则，查找table下的tbody下的每行第一个td中的input，保存在chbs中
    else{
        var chbs = document.querySelectorAll("#tbody>tr>td:first-child>input[type='checkbox']");
        //遍历chbs中每个chb
        for(var i = 0;i < chbs.length;i++){
            //如果当前chb的checked为false
            if(chbs[i].checked === false){
                //则chbAll的checked为false
                chbAll.checked = false;
                return;  //退出函数
            }
        }  //（遍历结束）
        //设置chbAll的checked为true
        chbAll.checked = true;
        /*
         运用状态选择器 替代 遍历
         var unchecked = document.querySelector("tbody>tr>td>input:not(:checked)");
         //如果没找到未选中的，就选中全选chb，否则就取消全选chb
         chbAll.checked = unchecked == null?true:false;
         */
    }
}
/* 批量删除用户 */
batchDel.onclick = function(obj){
    var chbAll = document.querySelector("#thead>tr>th>input[type='checkbox']");
    var chbs = document.querySelectorAll("#tbody>tr>td:first-child>input[type='checkbox']");
    //先检查thead中的是否被选中，若被选中，则无需遍历tbody中
    if(chbAll.checked === true){  //全选中
        for(var i = 0;i < chbs.length;i++){
            transPidsArr.push(chbs[i].getAttribute("data-transId"));
        }
    }
    else{  //未全选中
        //遍历tbody中，若选中则压入
        for(var i = 0;i < chbs.length;i++){
            if(chbs[i].checked === true){
                transPidsArr.push(chbs[i].getAttribute("data-transId"));
            }
        }
    }
    var transPids = JSON.stringify(transPidsArr);  //转字符串
    layer.confirm('确认要删除吗？',function(index){
        /* 异步请求删除数据 */
        $.ajax({
            type: "POST",
            url: "http://" + ip + "/bcat/loginInfo/removeInfoBatch.do?jsonp=?",
            data: {ids:transPids},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!',{icon:1,time:1000});
                    getUserLoginStatus();
                }
                else{
                    layer.msg('删除失败!',{icon:1,time:1000});
                }
            }
        });
    });
}

/* 按条件查找用户登录记录 */
btn.onclick = function(){
    $("#DataTables_Table_0_paginate").css("display","none");
    $("#DataTables_Table_0_info").css("display","none");
    var datemin = document.getElementById("datemin");
    var minDate = datemin.value;  //开始时间
    var datemax = document.getElementById("datemax");
    var maxDate = datemax.value;  //结束时间
    getQueryUserFriendList(minDate,maxDate);
}
function getQueryUserFriendList(minDate,maxDate){
    $.ajax({
        type:"GET",
        url:"http://" + ip + "/bcat/loginInfo/queryLogin.do?startTime=" + minDate + "&endTime=" + maxDate + "&jsonp=?",
        dataType:"jsonp",
        success:function(datalist){
            var html = "";
            $.each(datalist.result.loginList,function(i,value){
                //序号 字符串 转 数字
                var pageNo = parseInt(datalist.result.pageNo);
                var iNum = parseInt(i);
                html += `
                    <tr class="text-c">
                        <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.loginId}" /></td>
                        <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                        <td data-id="dadaID">${value.lPid}</td>
                        <td>${value.loginIp}</td>  <!-- IP需要修改 -->
                        <td>${value.loginDevice}</td>  <!-- 设备需要修改 -->
                        <td>${value.loginTime}</td>  <!-- 登录时间需要修改 -->
                        <td>${value.quitTime}</td>  <!-- 退出时间需要修改 -->
                        <td class="f-14" data-transId="${value.loginId}">
                            <a title="删除" href="javascript:;" onclick="member_del(this,sessionStorage.getItem('transLoginId'))" class="ml-5" style="text-decoration:none">
                                <i class="Hui-iconfont">&#xe6e2;</i>
                            </a>
                        </td>
                    </tr>
                `;
                /* 每页显示的首位编号 */
                $("#DataTables_Table_0_info span:first-child").html((pageNo - 2) * 10 + iNum + 2);
                $("#DataTables_Table_0_info span:last-child").html((pageNo - 2) * 10 + iNum + 11);
            });
            $("#tbody").html(html);
            /* 用户上传登录记录总数量 */
            $("#totalRecord").html(datalist.result.totalRecord);
        }
    });
}