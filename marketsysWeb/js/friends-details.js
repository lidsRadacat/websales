var pageNum = 1;  //保存当前正在浏览的页数
var transFriendId = sessionStorage.getItem("transFriendId");

/* 异步请求用户好友列表详情 */
$.ajax({
    type:"GET",
    //async:false,
    url:"http://" + ip + "/bcat/friendsBackup/friendDetail.do?Id=" + transFriendId + "&jsonp=?",
    dataType:"jsonp",  //数据类型为jsonp
    //jsonpCallback: "member_show",  //服务端用于接收callback调用的function名的参数
    success:function(datalist){
        //console.log(datalist);
        var html = "";
        //性别 数字 转 汉字
        var gender = getGender(datalist.result.gender);
        //年龄 字符串 转 数字
        var age = getAge(datalist.result.birthday);
        html += `

        `;

        $("#outer_tbody").html(html);  //用户详细信息
        $("#nickname").html(sessionStorage.getItem("nickname"));  //头部昵称
        $("#signature").html(datalist.result.signature);  //个性签名
    }
});

//求年龄
function getAge(birthday){
    var age = new Date(new Date().getTime() - birthday).getFullYear() - 1970;
    if(age < 0){
        age = -age;
    }
    return age;
}
//修改性别
function getGender(genderNum){
    if(genderNum === "1"){
        return "男";
    }
    else if(genderNum === "2"){
        return "女";
    }
}
