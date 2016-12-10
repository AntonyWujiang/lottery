//Created by 01170626 on 2016/12/5.
$(document).ready(function () {
    refreshPage();
});

var awards = "";

function refreshPage(){
    $.ajax({
        type: "post",
        url : getContextPath() + "/award/getAllAwards",
        dataType:'json',
        data: {
        },
        success: function(data){
            awards = data.data;
            var awardHtml = "";
            var iLen = awards.length;
            for(var i = iLen - 1 ; i >=0  ; i--){
                awardHtml+="<tr><td><span id='span"+i+"' style='cursor:pointer;' onclick='selectAward("+i+","+iLen+")' class='label label-default'>"+"选中"+"</span></td><td>"+awards[i].awName+"</td><td>"+awards[i].awDescription+"</td><td>"+
                    awards[i].awUserCount+"</td><td>"+awards[i].awKind+"</td><td><span style='cursor:pointer;' class='label label-info' onclick='confirmUpdateAward("+i+")'>"+"编辑"+"</span></td><td>" +
                    "<span class='label label-danger' style='cursor:pointer;' onclick='comfirmDeleteAward("+awards[i].id+")'>"+"删除"+"</span></td></tr>";
            }
            $("#awardTable").html(awardHtml);
        }
    });
}

function selectAward(i,iLen){
    $.ajax({
        type: "post",
        url : getContextPath() + "/config/setCurrentAward",
        dataType:'json',
        data: {
            "awardId":awards[i].id
        },
        success: function(data){
            var selectSuccess = data.data;
            if(selectSuccess){
                var spanId = "span"+i;
                $("#"+spanId).attr("class","label label-success");
                for(var m = iLen - 1 ; m >=0  ; m--){
                    if(m!=i){
                        var otherSpanId = "span"+m;
                        $("#"+otherSpanId).attr("class","label label-default");
                    }
                }
            }else{
                layer.msg('选中失败', {
                    time: 500, //20s后自动关闭
                });
            }
        }
    });
}

function comfirmDeleteAward(awardId) {
    layer.confirm('确定要删除该奖项吗？', {
        btn: ['删除','取消'] //按钮
    }, function(){
        deleteAward(awardId);
    }, function(){
        layer.msg('取消删除', {
            time: 500, //20s后自动关闭
        });
    });
}


function deleteAward(awardId) {
    $.ajax({
        type: "post",
        url : getContextPath() + "/award/deleteAward?awardId="+awardId,
        dataType:'json',
        data: {
        },
        success: function(data){
            var deleteSuccess = data.data;
            if(deleteSuccess){
                layer.msg('删除成功', {
                    time: 500, //20s后自动关闭
                    // btn: ['明白了', '知道了']
                });
                refreshPage();
            }else{
                layer.msg('删除失败', {
                    time: 500, //20s后自动关闭
                    // btn: ['明白了', '知道了']
                });
            }
        }
    });
}

function confirmUpdateAward(i) {
    layer.open({
        type: 1,
        closeBtn: false,
        shift: 7,
        shadeClose: true,
        content: "<div style='width:350px;'><div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入奖项名称</p><input id='awardName' class='form-control' type='text' name='awardName' value='"+awards[i].awName+"'/></div>" +
        "<div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入奖项描述</p><input id='awardDescription' class='form-control' type='text' name='awardDescription' value='"+awards[i].awDescription+"'/></div>"+
        "<div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入获奖人数</p><input id='awardUserCount' class='form-control' type='number' name='awardUserCount' value='"+awards[i].awUserCount+"'/></div>"+
        "<div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入奖项类别</p><input id='awardKind' class='form-control' type='text' name='awardKind' value='"+awards[i].awKind+"'/>" +
        "<button style='margin-top:5%;' type='button' class='btn btn-block btn-success btn-lg' onclick='updateAward("+awards[i].id+")'>提交</button></div>"
    });
}

function updateAward(awardId){

    var awardUserCount = $("#awardUserCount").val();
    if(awardUserCount*1>1877 || awardUserCount*1<1){
        layer.msg('人数必须是1到1877', {
            time: 500, //20s后自动关闭
            // btn: ['明白了', '知道了']
        });
    }else{
        var awardName = $("#awardName").val();
        var awardDescription = $("#awardDescription").val();
        var awardKind = $("#awardKind").val();
        $.ajax({
            type: "post",
            url : getContextPath() + "/award/updateAward",
            dataType:'json',
            data: {
                "awardId":awardId,
                "awardName":awardName,
                "awardDescription":awardDescription,
                "awardUserCount":awardUserCount,
                "awardKind":awardKind
            },
            success: function(data){
                var updateSuccess = data.data;
                if(updateSuccess){
                    layer.msg('修改成功', {
                        time: 500, //20s后自动关闭
                        // btn: ['明白了', '知道了']
                    });
                    refreshPage();
                }else{
                    layer.msg('修改失败', {
                        time: 500, //20s后自动关闭
                        // btn: ['明白了', '知道了']
                    });
                }
            }
        });
        layer.closeAll();
    }
}

function confirmAddAward(){
    layer.open({
        type: 1,
        closeBtn: false,
        shift: 7,
        shadeClose: true,
        content: "<div style='width:350px;'><div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入奖项名称</p><input id='awardName' class='form-control' type='text' name='awardName' /></div>" +
        "<div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入奖项描述</p><input id='awardDescription' class='form-control' type='text' name='awardDescription' /></div>"+
        "<div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入获奖人数</p><input id='awardUserCount' class='form-control' type='number' name='awardUserCount' /></div>"+
        "<div style='width:320px;margin-left: 3%;' class='form-group has-feedback'><p>请输入奖项类别</p><input id='awardKind' class='form-control' type='text' name='awardKind' />" +
        "<button style='margin-top:5%;'type='button' class='btn btn-block btn-success btn-lg' onclick='addAward()'>提交</button></div>"
    });
}

function addAward() {
    var awardUserCount = $("#awardUserCount").val();
    if (awardUserCount * 1 > 1877 || awardUserCount * 1 < 1) {
        layer.msg('人数必须是1到1877', {
            time: 500, //20s后自动关闭
            // btn: ['明白了', '知道了']
        });
    } else {
        var awardName = $("#awardName").val();
        var awardDescription = $("#awardDescription").val();
        var awardKind = $("#awardKind").val();
        $.ajax({
            type: "post",
            url: getContextPath() + "/award/addAward",
            dataType: 'json',
            data: {
                "awardName": awardName,
                "awardDescription": awardDescription,
                "awardUserCount": awardUserCount,
                "awardKind": awardKind
            },
            success: function (data) {
                var addSuccess = data.data;
                if (addSuccess) {
                    layer.msg('添加成功', {
                        time: 500, //20s后自动关闭
                        // btn: ['明白了', '知道了']
                    });
                    refreshPage();
                } else {
                    layer.msg('添加失败', {
                        time: 500, //20s后自动关闭
                        // btn: ['明白了', '知道了']
                    });
                }
            }
        });
        layer.closeAll();
    }
}


function startGift() {
    $.ajax({
        type: "post",
        url : getContextPath() + "/gift/start",
        dataType:'json',
        data: {
        },
        success: function(data){
            layer.msg('正在抽奖', {
                time: 500, //20s后自动关闭
            });
            $("#startGift").css("display","none");
            $("#endGift").css("display","block");
        }
    });
}

function endGift() {
    $.ajax({
        type: "post",
        url : getContextPath() + "/gift/end",
        dataType:'json',
        data: {
        },
        success: function(data){
            var awardWinners = data.data;
            var winnerHtml = "";
            var iLen = awardWinners.length;
            for(var i = iLen - 1 ; i >=0  ; i--){
                winnerHtml+="<tr><td>"+awardWinners[i].sfNum+"</td><td>"+awardWinners[i].sfName+"</td><td>"+
                    "<span class='label label-danger' style='cursor:pointer;' onclick='comfirmDeleteWinner("+awardWinners[i].id+")'>"+"删除"+"</span></td></tr>";
            }
            $("#winnerTable").html(winnerHtml);
            refreshPage();
            $("#startGift").css("display","block");
            $("#endGift").css("display","none");
        }
    });
}

function comfirmDeleteWinner(winnerId){
    layer.confirm('确定要删除该获奖用户吗？', {
        btn: ['删除','取消'] //按钮
    }, function(){
        deleteWinner(winnerId);
    }, function(){
        layer.msg('取消删除', {
            time: 500, //20s后自动关闭
        });
    });
}

function deleteWinner(winnerId) {
    $.ajax({
        type: "post",
        url : getContextPath() + "/user/deleteWinner?winnerId="+winnerId,
        dataType:'json',
        data: {
        },
        success: function(data){
            var deleteSuccess = data.data;
            if(deleteSuccess){
                layer.msg('删除成功', {
                    time: 500, //20s后自动关闭
                    // btn: ['明白了', '知道了']
                });
                refreshPage();
            }else{
                layer.msg('删除失败', {
                    time: 500, //20s后自动关闭
                    // btn: ['明白了', '知道了']
                });
            }
        }
    });
}