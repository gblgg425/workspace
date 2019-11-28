package com.grapro.bms.modules.account.service;

import com.grapro.bms.modules.account.entity.User;
import com.grapro.bms.modules.common.vo.Result;

public interface AccountService {
	
	Result insertUser(User user);
	
	Result getUserResult(User user);

	User getUserByName(String account);
	
	User getUserBySubject();


}
