/* 验证 */
var tgNameError = document.getElementById("tgName-error");
tgName.onblur = function(){
    if(this.validity.valueMissing){
        tgNameError.style.display = "block";  //显示提示语
        $("#tgName").addClass("error");  //背景变色
    }
}
tgName.onfocus = function(){
    tgNameError.style.display = "none";  //隐藏提示语
    $("#tgName").removeClass("error");  //清除背景
}
var tgDescribeError = document.getElementById("tgDescribe-error");
tgDescribe.onblur = function(){
    if(this.validity.valueMissing){
        tgDescribeError.style.display = "block";  //显示提示语
        $("#tgDescribe").addClass("error");  //背景变色
    }
}
tgDescribe.onfocus = function(){
    tgDescribeError.style.display = "none";  //隐藏提示语
    $("#tgDescribe").removeClass("error");  //清除背景
}
var tgAnnouncementError = document.getElementById("tgAnnouncement-error");
tgAnnouncement.onblur = function(){
    if(this.validity.valueMissing){
        tgAnnouncementError.style.display = "block";  //显示提示语
        $("#tgAnnouncement").addClass("error");  //背景变色
    }
}
tgAnnouncement.onfocus = function(){
    tgAnnouncementError.style.display = "none";  //隐藏提示语
    $("#tgAnnouncement").removeClass("error");  //清除背景
}
/* 提交 */
btn.onclick = function(){
    var tgNameValue = $("#tgName").val();  //群名称
    var tgAvatarValue = $("#tgAvatar").val();  //群头像
    var tgDescribeValue = $("#tgDescribe").val();  //群描述
    var tgAnnouncementValue = $("#tgAnnouncement").val();  //群公告
    addSubjectGroup(tgNameValue,tgAvatarValue,tgDescribeValue,tgAnnouncementValue);
}

var lastPageNum = sessionStorage.getItem("totalPage");  //获得最后一页
function addSubjectGroup(tgNameValue,tgAvatarValue,tgDescribeValue,tgAnnouncementValue){
    $.ajax({
        type: "POST",
        url: "http://" + ip + "/bcat/thematicGroup/saveGroup.do?jsonp=?",
        data: {tgName:tgNameValue,tgAvatar:tgAvatarValue,tgDescribe:tgDescribeValue,tgAnnouncement:tgAnnouncementValue},
        dataType: "jsonp",
        success: function (datalist){
            if(datalist.code === "2000"){
                layer.msg('添加成功!',{icon:1,time:1000});
                setTimeout(function(){
                    layer_close();  //调用 关闭弹出窗口 方法
                },1000);
                parent.location.reload();  //刷新父页面
                //todo:跳转到最后页面
            }
            else{
                layer.msg('添加失败!',{icon:1,time:1000});
            }
        }
    });
}



