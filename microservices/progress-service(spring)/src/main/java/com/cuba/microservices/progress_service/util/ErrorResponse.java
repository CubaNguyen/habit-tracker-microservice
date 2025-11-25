package com.cuba.microservices.progress_service.util;


import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
	private String code;
	private String path;
	private LocalDateTime timestamp;
}

