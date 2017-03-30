var dadaID = sessionStorage.getItem("dadaID");

//给用户昵称绑定单击事件，显示详细信息
$("#tbody").on("click","tr>td:nth-child(4)>u",function(){
    //console.log(this);  -> u
    var parent = this.parentNode;
    //console.log(this.parentNode); -> td
    var grandParent = parent.parentNode;
    //console.log(grandParent); -> tr
    //获得当前点击的用户的嗒嗒ID，以备后续使用
    var previous = parent.previousElementSibling;
    //存储
    sessionStorage.setItem("nickname",this.innerHTML);  //当前点击的用户的昵称
    sessionStorage.setItem("dadaID",previous.innerHTML);  //当前点击的用户的嗒嗒ID

    member_show('用户详细信息','member-show.html',previous.innerHTML,'360','400');
});
//异步请求用户详细信息
$.ajax({
    type:"GET",
    //async:false,
    url:"http://" + ip + "/bcat/user/userDetail.do?pid=" + dadaID + "&jsonp=?",
    dataType:"jsonp",  //数据类型为jsonp
    success:function(datalist){
        //console.log(datalist);
        var html = "";
        //性别 数字 转 汉字
        var gender = getGender(datalist.result.gender);
        //年龄 字符串 转 数字
        var age = getAge(datalist.result.birthday);
        html += `
            <tr>
                <th class="text-r" width="80">嗒嗒ID：</th>
                <td>${dadaID}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">真实姓名：</th>
                <td>${datalist.result.realName}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">性别：</th>
                <td>${gender}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">年龄：</th>
                <td>${age}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">手机：</th>
                <td>${datalist.result.mobile}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">邮箱：</th>
                <td>${datalist.result.email}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">地址：</th>
                <td>${datalist.result.province}&nbsp;${datalist.result.city}&nbsp;${datalist.result.userAddress}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">职业：</th>
                <td>${datalist.result.userJob}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">常用邮箱：</th>
                <td>${datalist.result.commonEmail}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">身份证：</th>
                <td>${datalist.result.identityCard}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">信用点：</th>
                <td>${datalist.result.creditValues}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">等级：</th>
                <td>${datalist.result.userGrade}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">积分：</th>
                <td>${datalist.result.creditValues}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">用户状态：</th>
                <td>${datalist.result.userStatus}</td>
            </tr>
            <tr>
                <th class="text-r" width="80">注册时间：</th>
                <td>${datalist.result.regTime}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="80">注册ip：</th>
                <td>${datalist.result.regIp}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="100">最后登录时间：</th>
                <td>${datalist.result.lastLogin}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="100">最后登录ip：</th>
                <td>${datalist.result.lastIp}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r" width="100">最后活跃时间：</th>
                <td>${datalist.result.lastActive}</td>
                <!--todo需要修改-->
            </tr>
            <tr>
                <th class="text-r">最近修改时间：</th>
                <td>${datalist.result.userModify}</td>
                <!--todo需要修改-->
            </tr>
        `;
        $("#outer_tbody").html(html);  //用户详细信息
        $("#nickname").html(sessionStorage.getItem("nickname"));  //头部昵称
        $("#signature").html(datalist.result.signature);  //个性签名
        //todo：判断个性签名为空
        //todo：用户头像
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