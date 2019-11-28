/**
 * organization-list.jsp
 */
// 树形结构的设置
var setting = {
	data : {
		simpleData : {
			enable : true
		}
	},
	// 拖动相关的设置
	edit : {
		enable : true,
		showRemoveBtn : false,
		showRenameBtn : false,
		drag : {
			isCopy : false,
			isMove : true
		}
	},
	// 回调：拖动触发的事件
	callback : {
		beforeDrop : bDrop,
		onClick : oClick
	}
};
// 树形结构的节点信息
var nodes = [ {
	'id' : '1',
	'pId' : '0',
	'name' : '公司',
	'open' : 'true',
	'icon' : 'images/company.png',
	'type' : 'company'
}, {
	'id' : '2',
	'pId' : '1',
	'name' : '后勤部门',
	'icon' : 'images/department.png',
	'type' : 'department'
}, {
	'id' : '3',
	'pId' : '1',
	'name' : '人力资源部门',
	'icon' : 'images/department.png',
	'type' : 'department'
}, {
	'id' : '4',
	'pId' : '1',
	'name' : '研发部门',
	'icon' : 'images/department.png',
	'type' : 'department'
}, {
	'id' : '5',
	'pId' : '2',
	'name' : '市场部门',
	'icon' : 'images/department.png',
	'type' : 'department'
}, {
	'id' : '6',
	'pId' : '3',
	'name' : '张三',
	'icon' : 'images/staff.png',
	'type' : 'staff'
},
{
	'id' : '7',
	'pId' : '3',
	'name' : '李四',
	'icon' : 'images/staff.png',
	'type' : 'staff'
}];

var AjaxNode=[{
	'id' : '0',
	'pId' : '-1',
	'name' : '公司',
	'open' : 'true',
	'icon' : 'images/company.png',
	'type' : 'company'
}];
// 使用ajax生成树
$(document).ready(function() {
	getOrganization();
});

function getOrganization(){
	  $.ajax({
  		type : "POST",
  		data :{	
  		},
  		dataType : "text",
  		url :"manageEmeController/getOrg.ajax",
  		success : function(result) {
  		 console.log(result);
  		 var ztreeJson=JSON.parse(result);//将json字符串转换成json对象
  		nodes=convertTree(ztreeJson);//组装后台数据
  		console.log(JSON.stringify(nodes));
  		$.fn.zTree.init($("#companytree"), setting, nodes);//激活ztree
  		},
  		error : function() {
  			layer.msg('无法连接服务器', {icon: 2});
  		}
  	});
}

function saveChanges(staffNode){
	$.ajax({
  		type : "POST",
  		data :{
  			userId:staffNode.id,
  			userDepartement:staffNode.pId
  		},
  		dataType : "text",
  		url :"manageEmeController/userChanged.ajax",
  		success : function(result) {
  		 console.log("after changed:"+result);
  		},
  		error : function() {
  			layer.msg('无法连接服务器', {icon: 2});
  		}
  	});
}
function getUserInfo(staffNode,departName){
	$.ajax({
  		type : "POST",
  		data :{
  			userId:staffNode.id, //staffNode.id用户id
  		},
  		dataType : "text",
  		url :"manageEmeController/getUserInfo.ajax",
  		success : function(result) {
  		 console.log("getUserInfo:"+result);
  		 var user=JSON.parse(result);//转换成json对象
  		 for(var key in user){//js里面类似于foreach写法
  			if(key=="userDepartement"){
  				$("#"+key+"").text(departName);
  			}else if(key=="userEntrytime"|key=="userBirthday"){
  				$("#"+key+"").text(new Date(user[key]).format("yyyy-MM-dd"));
  			}else{
  				$("#"+key+"").text(user[key]);
  			}
  			
  		 }
  		},
  		error : function() {
  			layer.msg('无法连接服务器', {icon: 2});
  		}
  	});
}
function convertTree(tree){
	for(var i=0,l=tree.length;i<l;i++){
			if(tree[i].pId=="0"){
				tree[i].type="department";
				tree[i].icon='images/department.png';			
			}else{
				tree[i].type="staff";
				tree[i].icon='images/staff.png';
			}
			AjaxNode.push(tree[i]);
		}
	return AjaxNode;
}
/* 拖动操作，更新数据库的节点结构 */
function bDrop(reeId, treeNodes, targetNode, moveType) {//reeId被拖动的Id,treeNodesx拖动的数组，targetNode：目标节点，moveType：目标节点的类型
	var n = treeNodes[0];
	if(moveType!="company"){
		return false;
	}
	
	if (n.type == 'staff') {
		if(targetNode.type=='staff'|targetNode.type=='company'){
		
		return false;
	}else{
		//拖拽成功的回调
		n.pId=targetNode.id;//将被拖动的节点的父节点重新赋值为目标节点的id
		saveChanges(n);
		return true;
	}
		
	} else {
		layer.msg("仅允许调动员工",{icon:2});
		return false;
	}
	
}

/* 点击操作，如果是员工，显示该节点信息，否则展开/折叠该节点 */
function oClick(event, treeId, treeNode) {//treeId代表被点击节点的id,treeNode表示被点击的节点对象
	// 获取树对象
	var companytree = $.fn.zTree.getZTreeObj("companytree");//得到整个树的对象
	if (treeNode.type == 'staff') {//该节点为员工节点就触发getUserInfo函数，对数据库进行修改
		
		var node = companytree.getNodeByParam("id", treeNode.pId, null);//拿到父节点
		
		getUserInfo(treeNode,node.name);

	} else {
		// 否则，展开/关闭该节点
		companytree.expandNode(treeNode);
	}
}