package com.cts.client;

import org.springframework.stereotype.Component;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Component
public class AuditServiceClient {

	private final AuditFeignClient auditFeignClient;
	
	public AuditServiceClient(AuditFeignClient auditFeignClient)
	{
		this.auditFeignClient=auditFeignClient;
	}
	
	
	@CircuitBreaker(name="audit-service",fallbackMethod="auditFallback")
	public void log(Long userId, String action, String resource) 
	{
			AuditLogRequest request=new AuditLogRequest(userId, action, resource);
			auditFeignClient.log(request);
	}
	
	public void auditFallback(Long userId,String action,String resource,Throwable t) {
		System.err.println("[Citizen] Audit logging failed: "+t.getMessage());
	}
}
