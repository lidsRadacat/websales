var pageNum = 1;  //���浱ǰ���������ҳ��
//var dadaID = sessionStorage.getItem("dadaID");
var transChatId = sessionStorage.getItem("transChatId");

//�첽����������ϸ��Ϣ
$.ajax({
    type:"GET",
    //async:false,
    url:"http://" + ip + "/bcat/messages/messageDetail.do?Id=" + transChatId + "&jsonp=?",
    dataType:"jsonp",  //��������Ϊjsonp
    //jsonpCallback: "member_show",  //��������ڽ���callback���õ�function���Ĳ���
    success:function(datalist){
        //console.log(datalist);
        var html = "";
        //�Ա� ���� ת ����
        var gender = getGender(datalist.result.gender);
        //���� �ַ��� ת ����
        var age = getAge(datalist.result.birthday);
        html += `

        `;

        $("#outer_tbody").html(html);  //�û���ϸ��Ϣ
        $("#nickname").html(sessionStorage.getItem("nickname"));  //ͷ���ǳ�
        $("#signature").html(datalist.result.signature);  //����ǩ��
    }
});

//������
function getAge(birthday){
    var age = new Date(new Date().getTime() - birthday).getFullYear() - 1970;
    if(age < 0){
        age = -age;
    }
    return age;
}
//�޸��Ա�
function getGender(genderNum){
    if(genderNum === "1"){
        return "��";
    }
    else if(genderNum === "2"){
        return "Ů";
    }
}
