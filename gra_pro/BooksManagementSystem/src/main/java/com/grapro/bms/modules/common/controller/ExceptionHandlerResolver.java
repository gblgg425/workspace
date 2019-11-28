package com.grapro.bms.modules.common.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.AuthorizationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.grapro.bms.modules.common.vo.Result;


/**
 * 异常处理类
 */
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ExceptionHandlerResolver {

	/**
	 * 集中处理 controller 层 AuthorizationException 异常
	 */
	@ExceptionHandler(value=AuthorizationException.class)
	@ResponseBody
	public Result handlerAccessDeniedException(HttpServletRequest reuqest, 
			AuthorizationException exception) {
		return new Result(500, "你没有权限。");
	}
}
