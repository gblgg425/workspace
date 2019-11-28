package com.grapro.bms.modules.common.vo;

/**
 * 返回结果封装类
 * 
 */
public class Result {
	// 状态
	private int status;
	// 信息
	private String message;
	// 对象
	private Object object;
	
	public Result() {
	}

	public Result(int status, String message) {
		this.status = status;
		this.message = message;
	}

	public Result(int status, String message, Object object) {
		this.status = status;
		this.message = message;
		this.object = object;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getObject() {
		return object;
	}

	public void setObject(Object object) {
		this.object = object;
	}

}
