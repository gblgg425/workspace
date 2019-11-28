package com.grapro.bms.config.shiro;

import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.grapro.bms.modules.account.entity.User;
import com.grapro.bms.modules.account.service.AccountService;
import com.grapro.bms.modules.authority.entity.Role;
import com.grapro.bms.modules.common.constant.SystemConstant;


/**
 * Shiro核心组件，实现用户验证和授权两大功能
 * 
 */
@Component
public class MyRealm extends AuthorizingRealm {
	
	@Autowired
	private AccountService accountService;

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		// 授权类
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		
//		// 获取user信息
		String userName = (String) principals.getPrimaryPrincipal();
		User user = accountService.getUserByName(userName);
		if (user == null) {
			return null;
		}
		
		if (userName.equals("admin")) {
			authorizationInfo.addRole("admin");
		}
//		// 获取角色信息，配合页面标签，确定不同角色访问不同的资源
/*		List<Role> roles = accountService.getRolesByUserId(user.getUserId());
		for (Role role : roles) {
			authorizationInfo.addRole(role.getRoleName());
			List<Resource> resources = accountService.getResourcesByRoleId(role.getRoleId());
			for (Resource resource : resources) {
				authorizationInfo.addStringPermission(resource.getPermission());
			}
		}*/
		
		return authorizationInfo;
	}

	
	 // 身份验证
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		
		String account = (String) token.getPrincipal();
		User user = accountService.getUserByName(account);
		if (user == null) {
			throw new UnknownAccountException("The account do not exist.");
		}	
		
		Subject subject = SecurityUtils.getSubject();
		subject.getSession().setAttribute(SystemConstant.USER_KEY, user.getUserId());
		
		// realmName: 当前 realm 对象的唯一名字. 调用父类的 getName() 方法
		return new SimpleAuthenticationInfo(account, user.getPassword(), getName());
	}

}
