package com.cuba.microservices.habit_service.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import com.cuba.microservices.habit_service.dto.ApiResponse;
import com.cuba.microservices.habit_service.dto.ErrorResponse;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

// 	@ExceptionHandler(CustomException.class)
// 	public ResponseEntity<ApiResponse<Object>> handleCustomException(CustomException ex, WebRequest request) {
// 		ErrorResponse error = ErrorResponse.builder().code(ex.getCode())
// 				.path(((ServletWebRequest) request).getRequest().getRequestURI()).timestamp(LocalDateTime.now())
// 				.build();

// 		return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage(), error));
// 	}

// 	@ExceptionHandler(Exception.class)
// 	public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex, WebRequest request) {
// 		ErrorResponse error = ErrorResponse.builder().code("INTERNAL_SERVER_ERROR")
// 				.path(((ServletWebRequest) request).getRequest().getRequestURI()).timestamp(LocalDateTime.now())
// 				.build();

// 		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// 				.body(ApiResponse.fail("An unexpected error occurred", error));
// 	}
	
// }
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Object>> handleCustomException(CustomException ex, WebRequest request) {
  Throwable root = ex;
    while (root.getCause() != null && root.getCause() != root) {
        root = root.getCause();
    }
    log.error("[GlobalExceptionHandler] 💥 Root cause: {}", root.toString()); // chỉ 1 dòng duy nhất
        ErrorResponse error = ErrorResponse.builder()
                .code(ex.getCode())
                .path(((ServletWebRequest) request).getRequest().getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage(), error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex, WebRequest request) {
        log.error("[GlobalExceptionHandler] 💥 Unhandled Exception: {}", ex.getMessage(), ex);
        ErrorResponse error = ErrorResponse.builder()
                .code("INTERNAL_SERVER_ERROR")
                .path(((ServletWebRequest) request).getRequest().getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail("An unexpected error occurred", error));
    }
}
