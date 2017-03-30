var loginName = null;  //保存当前登录的用户名
var pageNum = 1;  //保存当前正在浏览的页数
var transPidsArr = [];  //保存批量删除值transPids

/* 异步请求主题群列表 */
function getSubjectGroup(){
    $.ajax({
        type:"GET",
        url:"http://" + ip + "/bcat/thematicGroup/groupPage.do?pageNo=" + pageNum + "&jsonp=?",
        dataType:"jsonp",
        success:function(datalist){
            //console.log(datalist.result);
            var status = "";  //群状态
            var html = "";
            var totalPage = datalist.result.totalPage;  //总页数
            sessionStorage.setItem("totalPage",totalPage);  //保存 总页数 到本地 直接写偶尔会报错
            var nowPage = datalist.result.pageNo;  //当前页
            sessionStorage.setItem("nowPage",nowPage);  //保存 当前页 到本地
            $.each(datalist.result.tGroupList,function(i,value){
                //需要传到后台的编号
                sessionStorage.setItem("transSubjectGroupId",value.thematicGroupId);
                //群状态 数字 转 汉字
                status = getStatus(value.groupStatus);
                //序号 字符串 转 数字
                var pageNo = parseInt(datalist.result.pageNo);
                var iNum = parseInt(i);
                if(value.groupStatus === "0"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.thematicGroupId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td>${value.thematicGroupId}</td>
                            <td>${value.tgName}</td>
                            <td>${value.tgDescribe}</td>
                            <td>${value.tgAnnouncement}</td>
                            <td>${value.tgCreateTime}</td>  <!-- 时间需要修改 -->
                            <td class="td-status"><span class="label label-success radius">${status}</span></td>
                            <td class="td-manage" data-transId="${value.thematicGroupId}">
                                <a title="禁用" style="text-decoration:none" onclick="member_stop(this,sessionStorage.getItem('transSubjectGroupId'))" href="javascript:;" ><i class="Hui-iconfont">&#xe631;</i></a>
                                <a title="修改" href="javascript:;" onclick="member_edit('修改','subject-group-revise.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a title="查看详情" href="javascript:;" onclick="member_show('查看详情','subject-group-show.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe602;</i></a>
                                <a title="删除" href="javascript:;" onclick="member_del(this,sessionStorage.getItem('transSubjectGroupId'))" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    `;
                }
                else if(value.groupStatus === "1"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.thematicGroupId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td>${value.thematicGroupId}</td>
                            <td>${value.tgName}</td>
                            <td>${value.tgDescribe}</td>
                            <td>${value.tgAnnouncement}</td>
                            <td>${value.tgCreateTime}</td>  <!-- 时间需要修改 -->
                            <td class="td-status"><span class="label label-defaunt radius">${status}</span></td>
                            <td class="td-manage" data-transId="${value.thematicGroupId}">
                                <a title="恢复正常" style="text-decoration:none" onclick="member_start(this,sessionStorage.getItem('transSubjectGroupId'))" href="javascript:;" ><i class="Hui-iconfont">&#xe6e1;</i></a>
                                <a title="修改" href="javascript:;" onclick="member_edit('修改','subject-group-revise.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a title="查看详情" href="javascript:;" onclick="member_show('查看详情','subject-group-show.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe602;</i></a>
                                <a title="删除" href="javascript:;" onclick="member_del(this,sessionStorage.getItem('transSubjectGroupId'))" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    `;
                }
                /* 每页显示的首位编号 */
                $("#DataTables_Table_0_info span:first-child").html((pageNo - 2) * 10 + iNum + 2);
                $("#DataTables_Table_0_info span:last-child").html((pageNo - 2) * 10 + iNum + 11);
            });
            $("#tbody").html(html);
            /* 用户总数量 */
            $("#totalRecord").html(datalist.result.totalRecord);
            //每拉取一次数据，使全选框处于非选中状态
            var chbAll = document.querySelector("#thead>tr>th>input[type='checkbox']");
            chbAll.checked = false;
        }
    });
}
getSubjectGroup();

/* 群状态 */
function getStatus(statusNum){
    if(statusNum === "0"){
        return "正常";
    }
    else if(statusNum === "1"){
        return "禁用";
    }
}

/* 上/下一页操作 */
var previous = document.getElementById("DataTables_Table_0_previous");
previous.onclick = function(){
    next.style.opacity = "1";
    if(pageNum > 1){
        pageNum--;
        previous.style.opacity = "1";
        getSubjectGroup();
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
        getSubjectGroup();
        $("#DataTables_Table_0_paginate>span>a").html(pageNum);  //改变显示页码
        if(pageNum == totalPage){
            next.style.opacity = "0";
        }
    }
}

/* 给 查看详情 按钮绑定单击事件，显示详细信息 */
$("#tbody").on("click","tr>td:last-child>a[title='查看详情']",function(){
    var parent = this.parentNode;
    var transSubjectGroupId = parent.getAttribute("data-transId");  //要传到后台的编号transSubjectGroupId
    sessionStorage.setItem("transSubjectGroupId",transSubjectGroupId);
});
/* 给 编辑 按钮绑定单击事件，显示详细信息 */
$("#tbody").on("click","tr>td:last-child>a[title='修改']",function(){
    var parent = this.parentNode;
    var transSubjectGroupId = parent.getAttribute("data-transId");  //要传到后台的编号transSubjectGroupId
    sessionStorage.setItem("transSubjectGroupId",transSubjectGroupId);
});
/* 给 删除 按钮绑定单击事件，告诉后台成功删除*/
$("#tbody").on("click","tr>td:last-child>a[title='删除']",function(){
    var parent = this.parentNode;
    //var grandParent = parent.parentNode;
    var transSubjectGroupId = parent.getAttribute("data-transId");  //传到后台的编号transSubjectGroupId
    sessionStorage.setItem("transSubjectGroupId",transSubjectGroupId);
    member_del(this,sessionStorage.getItem("transSubjectGroupId"));
});
/* 群 - 删除 */
function member_del(obj,id){
    layer.confirm('确认要删除吗？',function(index){
        /* 异步请求删除数据 */
        $.ajax({
            type: "POST",
            url: "http://" + ip + "/bcat/thematicGroup/removeGroup.do?jsonp=?",
            data: {Id:sessionStorage.getItem("transSubjectGroupId")},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!',{icon:1,time:1000});
                    getSubjectGroup();
                }
                else{
                    layer.msg('删除失败!',{icon:1,time:1000});
                }
            }
        });
    });
}
/* 给 禁用 按钮绑定单击事件，告诉后台成功禁用*/
$("#tbody").on("click","tr>td:last-child>a[title='禁用']",function(){
    var parent = this.parentNode;
    //var grandParent = parent.parentNode;
    var transSubjectGroupId = parent.getAttribute("data-transId");  //传到后台的编号transSubjectGroupId
    sessionStorage.setItem("transSubjectGroupId",transSubjectGroupId);
    member_stop(this,sessionStorage.getItem("transSubjectGroupId"));
});
/* 群 - 禁用 */
function member_stop(obj,id){
    layer.confirm('确认要禁用吗？',function(index){
        /* 异步请求禁用 */
        $.ajax({
            type: "POST",
            url: "http://" + ip + "/bcat/thematicGroup/banGroup.do?jsonp=?",
            data: {Id:sessionStorage.getItem("transSubjectGroupId")},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").find(".td-manage").prepend(`<a style="text-decoration:none" onclick="member_start(this,sessionStorage.getItem('transSubjectGroupId'))" href="javascript:;" title="恢复正常"><i class="Hui-iconfont">&#xe6e1;</i></a>`);
                    $(obj).parents("tr").find(".td-status").html('<span class="label label-defaunt radius">禁用</span>');
                    $(obj).remove();
                    layer.msg('已禁用!',{icon: 5,time:1000});
                    getSubjectGroup();
                }
                else{
                    layer.msg('禁用失败!',{icon:1,time:1000});
                }
            }
        });
    });
}
/* 给 正常 按钮绑定单击事件，告诉后台成功恢复正常*/
$("#tbody").on("click","tr>td:last-child>a[title='恢复正常']",function(){
    var parent = this.parentNode;
    //var grandParent = parent.parentNode;
    var transSubjectGroupId = parent.getAttribute("data-transId");  //传到后台的编号transSubjectGroupId
    sessionStorage.setItem("transSubjectGroupId",transSubjectGroupId);
    member_start(this,sessionStorage.getItem("transFriendId"));
});
/* 群 - 正常 */
function member_start(obj,id){
    layer.confirm('确认要恢复正常吗？',function(index){
        /* 异步请求恢复正常 */
        $.ajax({
            type: "POST",
            url: "http://" + ip + "/bcat/thematicGroup/relieveGroup.do?jsonp=?",
            data: {Id:sessionStorage.getItem("transSubjectGroupId")},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").find(".td-manage").prepend(`<a style="text-decoration:none" onclick="member_stop(this,sessionStorage.getItem('transSubjectGroupId'))" href="javascript:;" title="禁用"><i class="Hui-iconfont">&#xe631;</i></a>`);
                    $(obj).parents("tr").find(".td-status").html('<span class="label label-success radius">正常</span>');
                    $(obj).remove();
                    layer.msg('已恢复正常!',{icon: 6,time:1000});
                    getSubjectGroup();
                }
                else{
                    layer.msg('恢复失败!',{icon:1,time:1000});
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
            url: "http://" + ip + "/bcat/thematicGroup/removeGroupBatch.do?jsonp=?",
            data: {Ids:transPids},
            dataType: "jsonp",
            success: function (txt){
                if(txt.code === "2000"){
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!',{icon:1,time:1000});
                    getSubjectGroup();
                }
                else{
                    layer.msg('删除失败!',{icon:1,time:1000});
                }
            }
        });
    });
}

/* 按条件查找主题群 */
btn.onclick = function(){
    $("#DataTables_Table_0_paginate").css("display","none");
    $("#DataTables_Table_0_info").css("display","none");
    var datemin = document.getElementById("datemin");
    var minDate = datemin.value;  //开始时间
    var datemax = document.getElementById("datemax");
    var maxDate = datemax.value;  //结束时间
    var choice = document.getElementById("choice");
    var choiceValue = choice.value;  //选择条件
    var input = document.getElementById("input");
    var inputValue = input.value;  //输入条件
    getQuerySubjectGroupList(minDate,maxDate,choiceValue,inputValue);
}
function getQuerySubjectGroupList(minDate,maxDate,choiceValue,inputValue){
    $.ajax({
        type:"GET",
        url:"http://" + ip + "/bcat/thematicGroup/queryGroup.do?startTime=" + minDate + "&endTime=" + maxDate + "&queryKey=" + choiceValue + "&queryValue=" + inputValue + "&jsonp=?",
        dataType:"jsonp",
        success:function(datalist){
            var status = "";  //群状态
            var html = "";
            $.each(datalist.result.tGroupList,function(i,value){
                //需要传到后台的编号
                sessionStorage.setItem("transSubjectGroupId",value.thematicGroupId);
                //群状态 数字 转 汉字
                status = getStatus(value.groupStatus);
                //序号 字符串 转 数字
                var pageNo = parseInt(datalist.result.pageNo);
                var iNum = parseInt(i);
                if(value.groupStatus === "0"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.thematicGroupId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td>${value.thematicGroupId}</td>
                            <td>${value.tgName}</td>
                            <td>${value.tgDescribe}</td>
                            <td>${value.tgAnnouncement}</td>
                            <td>${value.tgCreateTime}</td>  <!-- 时间需要修改 -->
                            <td class="td-status"><span class="label label-success radius">${status}</span></td>
                            <td class="td-manage" data-transId="${value.thematicGroupId}">
                                <a title="禁用" style="text-decoration:none" onclick="member_stop(this,sessionStorage.getItem('transSubjectGroupId'))" href="javascript:;" ><i class="Hui-iconfont">&#xe631;</i></a>
                                <a title="修改" href="javascript:;" onclick="member_edit('修改','subject-group-revise.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a title="查看详情" href="javascript:;" onclick="member_show('查看详情','subject-group-show.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe602;</i></a>
                                <a title="删除" href="javascript:;" onclick="member_del(this,sessionStorage.getItem('transSubjectGroupId'))" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    `;
                }
                else if(value.groupStatus === "1"){
                    html += `
                        <tr class="text-c">
                            <td><input type="checkbox" value="${(pageNo-1)*10+iNum+1}" name="${(pageNo-1)*10+iNum+1}" onclick="checkSel(this)" data-transId="${value.thematicGroupId}" /></td>
                            <td>${(pageNo - 1) * 10 + iNum + 1}</td>
                            <td>${value.thematicGroupId}</td>
                            <td>${value.tgName}</td>
                            <td>${value.tgDescribe}</td>
                            <td>${value.tgAnnouncement}</td>
                            <td>${value.tgCreateTime}</td>  <!-- 时间需要修改 -->
                            <td class="td-status"><span class="label label-defaunt radius">${status}</span></td>
                            <td class="td-manage" data-transId="${value.thematicGroupId}">
                                <a title="恢复正常" style="text-decoration:none" onclick="member_start(this,sessionStorage.getItem('transSubjectGroupId'))" href="javascript:;" ><i class="Hui-iconfont">&#xe6e1;</i></a>
                                <a title="修改" href="javascript:;" onclick="member_edit('修改','subject-group-revise.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a title="查看详情" href="javascript:;" onclick="member_show('查看详情','subject-group-show.html','4','','510')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe602;</i></a>
                                <a title="删除" href="javascript:;" onclick="member_del(this,sessionStorage.getItem('transSubjectGroupId'))" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    `;
                }
                /* 每页显示的首位编号 */
                $("#DataTables_Table_0_info span:first-child").html((pageNo - 2) * 10 + iNum + 2);
                $("#DataTables_Table_0_info span:last-child").html((pageNo - 2) * 10 + iNum + 11);
            });
            $("#tbody").html(html);
            /* 用户总数量 */
            $("#totalRecord").html(datalist.result.totalRecord);
        }
    });
}












