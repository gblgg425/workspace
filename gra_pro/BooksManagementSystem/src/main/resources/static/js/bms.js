$(document).ready(function() {
	/*
	 * 用户注册
	 */
	$("#registerButton").bind("click", function() {
		var user = {};
		user.account = $("[name='account']").val();
		user.password = $("[name='password']").val();
		var layer = layui.layer;
		$.ajax({
			url : "/account/doRegister",
			type : "post",
			contentType: "application/json",
			data : JSON.stringify(user),
			success : function (data) {
				if (data.status == 200) {
					// todo
					location.href = "/login";
				} else {
					layer.msg(data.message, {icon: 0});
				}
			},
			error : function (data) {
				layer.msg(data.responseText, {icon: 0});
			}
		});
	});
	
	/*
	 * 用户登录
	 */
	$("#loginButton").bind("click", function() {
		var user = {};
		user.account = $("[name='account']").val();
		user.password = $("[name='password']").val();
		var layer = layui.layer;
		$.ajax({
			url : "/account/doLogin",
			type : "post",
			contentType: "application/json",
			data : JSON.stringify(user),
			success : function (data) {
				if (data.status == 200) {
					location.href = "/index";
				} else {
					layer.msg(data.message, {icon: 0});
				}
			},
			error : function (data) {
				layer.msg(data.responseText, {icon: 0});
			}
		});
	});
	
});