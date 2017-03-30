var pageNum = 1;  //保存当前正在浏览的页数
var transPidsArr = [];  //保存批量删除值transPids

/* 异步请求用户私信记录 */
function getUserPrivateStatus(){
    $.ajax({
        type:"GET",
        url:"http://" + ip + "/bcat/privateLette/lettes.do?pageNo=" + pageNum + "&jsonp=?",
        dataType:"jsonp",
        success:function(datalist){
            var status = "";  //消息状态
            var html = "";
            sessionStorage.setItem("totalPage",datalist.result.totalPage);  //保存总页数到本地
            $.each(datalist.result.privateLetteList,function(i,value){
                sessionStorage.setItem("transFriendId",value.letteInfoId);  //保存编号到本地

                //消息状态 数字 转 汉字
                status = getStatus(value.plStatus);
                //消息类型 数字 转 汉字
                type = getType(value.type);
                //序号 字符串 转 数字
                var pageNo = parseInt(datalist.result.pageNo);
                var iNum = parseInt(i);
                /* 设置不同用户状态对应的CSS样式 */
                if(value.plStatus === "0"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.privateLetteId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td data-id="dadaID">${value.plPid}</td>
                            <td>${value.toPid}</td>
                            <td>${type}</td>
                            <td>${value.plCreateTime}</td>  <!-- 发送时间需要修改 -->
                            <td>${value.plModify}</td>  <!-- 修改时间需要修改 -->
                            <td class="td-status"><span class="label label-success radius">${status}</span></td>
                            <td class="f-14" data-transId="${value.privateLetteId}">
                                <a title="查看详情" data-transId="${value.letteInfoId}" href="javascript:;" onclick="member_show('查看详情','private-details.html',${value.letteInfoId},'','510')" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe602;</i>
                                </a>
                                <a title="删除" href="javascript:;" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                    `;
                }
                else if(value.plStatus === "1"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.privateLetteId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td data-id="dadaID">${value.plPid}</td>
                            <td>${value.toPid}</td>
                            <td>${type}</td>
                            <td>${value.plCreateTime}</td>  <!-- 发送时间需要修改 -->
                            <td>${value.plModify}</td>  <!-- 修改时间需要修改 -->
                            <td class="td-status"><span class="label label-defaunt radius">${status}</span></td>
                            <td class="f-14" data-transId="${value.privateLetteId}">
                                <a title="查看详情" data-transId="${value.letteInfoId}" href="javascript:;" onclick="member_show('查看详情','private-details.html',${value.letteInfoId},'','510')" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe602;</i>
                                </a>
                                <a title="删除" href="javascript:;" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                    `;
                }
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
getUserPrivateStatus();

/* 消息状态 */
function getStatus(statusNum){
    if(statusNum === "0"){
        return "未读";
    }
    else if(statusNum === "1"){
        return "已读";
    }
}
/* 消息类型 */
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

/* 给 查看详情 按钮绑定单击事件，显示详细信息 */
$("#tbody").on("click","tr>td:last-child>a[title='查看详情']",function(){
    var transPrivateDetailId = this.getAttribute("data-transId");  //要传到后台的 查看详情 的编号transPrivateDetailId
    sessionStorage.setItem("transPrivateDetailId",transPrivateDetailId);
});
/* 给 删除 按钮绑定单击事件，告诉后台成功删除*/
$("#tbody").on("click","tr>td:last-child>a[title='删除']",function(){
    var parent = this.parentNode;
    //var grandParent = parent.parentNode;
    var transPrivateId = parent.getAttribute("data-transId");  //要传到后台的 删除 的编号transPrivateId
    sessionStorage.setItem("transPrivateId",transPrivateId);
    member_del(this,sessionStorage.getItem("transPrivateId"));
});
/* 用户 - 删除 */
function member_del(obj,id){
    layer.confirm('确认要删除吗？',function(index){
        /* 异步请求删除数据 */
        $.ajax({
            type: "POST",
            url: "http://" + ip + "/bcat/privateLette/removeLette.do?jsonp=?",
            data: {Id:sessionStorage.getItem("transPrivateId")},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!',{icon:1,time:1000});
                    getUserPrivateStatus();
                }
                else{
                    layer.msg('删除失败!',{icon:1,time:1000});
                }
            }
        });
    });
}
/* 上/下一页操作 */
var previous = document.getElementById("DataTables_Table_0_previous");
previous.onclick = function(){
    next.style.opacity = "1";
    if(pageNum > 1){
        pageNum--;
        previous.style.opacity = "1";
        getUserPrivateStatus();
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
        //sessionStorage.setItem("pageNum",pageNum);
        next.style.opacity = "1";
        getUserPrivateStatus();
        $("#DataTables_Table_0_paginate>span>a").html(pageNum);  //改变显示页码
        if(pageNum == totalPage){
            next.style.opacity = "0";
        }
    }
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
            url: "http://" + ip + "/bcat/privateLette/removeLetteBatch.do?jsonp=?",
            data: {ids:transPids},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!',{icon:1,time:1000});
                    getUserPrivateStatus();
                }
                else{
                    layer.msg('删除失败!',{icon:1,time:1000});
                }
            }
        });
    });
}

/* 按条件查找用户私信记录 */
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
        url:"http://" + ip + "/bcat/privateLette/queryLette.do?startTime=" + minDate + "&endTime=" + maxDate + "&jsonp=?",
        dataType:"jsonp",
        success:function(datalist){
            var status = "";  //私信状态
            var html = "";
            $.each(datalist.result.privateLetteList,function(i,value){
                //消息状态 数字 转 汉字
                status = getStatus(value.plStatus);
                //消息类型 数字 转 汉字
                type = getType(value.type);
                //序号 字符串 转 数字
                var pageNo = parseInt(datalist.result.pageNo);
                var iNum = parseInt(i);
                /* 设置不同用户状态对应的CSS样式 */
                if(value.plStatus === "0"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.privateLetteId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td data-id="dadaID">${value.plPid}</td>
                            <td>${value.toPid}</td>
                            <td>${type}</td>
                            <td>${value.plCreateTime}</td>  <!-- 发送时间需要修改 -->
                            <td>${value.plModify}</td>  <!-- 修改时间需要修改 -->
                            <td class="td-status"><span class="label label-success radius">${status}</span></td>
                            <td class="f-14" data-transId="${value.privateLetteId}">
                                <a title="查看详情" data-transId="${value.letteInfoId}" href="javascript:;" onclick="member_show('查看详情','private-details.html',${value.letteInfoId},'','510')" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe602;</i>
                                </a>
                                <a title="删除" href="javascript:;" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                    `;
                }
                else if(value.plStatus === "1"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.privateLetteId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td data-id="dadaID">${value.plPid}</td>
                            <td>${value.toPid}</td>
                            <td>${type}</td>
                            <td>${value.plCreateTime}</td>  <!-- 发送时间需要修改 -->
                            <td>${value.plModify}</td>  <!-- 修改时间需要修改 -->
                            <td class="td-status"><span class="label label-defaunt radius">${status}</span></td>
                            <td class="f-14" data-transId="${value.privateLetteId}">
                                <a title="查看详情" data-transId="${value.letteInfoId}" href="javascript:;" onclick="member_show('查看详情','private-details.html',${value.letteInfoId},'','510')" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe602;</i>
                                </a>
                                <a title="删除" href="javascript:;" class="ml-5" style="text-decoration:none">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                    `;
                }
                /* 每页显示的首位编号 */
                $("#DataTables_Table_0_info span:first-child").html((pageNo - 2) * 10 + iNum + 2);
                $("#DataTables_Table_0_info span:last-child").html((pageNo - 2) * 10 + iNum + 11);
            });
            $("#tbody").html(html);
            /* 用户上传私信记录总数量 */
            $("#totalRecord").html(datalist.result.totalRecord);
        }
    });
}