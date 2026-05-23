package com.cts.client;

import org.springframework.stereotype.Component;

@Component
public class AuditFeignClientFallback implements AuditFeignClient {

	@Override
	public void log(AuditLogRequest request) {
		System.err.println("[Citizen] Audit logging failed - action: "
                + request.getAction() + " for userId: " + request.getUserId());
	}

}
