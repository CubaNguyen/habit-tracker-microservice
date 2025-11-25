package com.cuba.microservices.habit_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
	private boolean success;
	private String message;
	private T data;
	private ErrorResponse error; // chú ý: dùng ErrorResponse trong package dto

	public static <T> ApiResponse<T> success(String message, T data) {
		return ApiResponse.<T>builder().success(true).message(message).data(data).error(null).build();
	}

	public static <T> ApiResponse<T> fail(String message, ErrorResponse error) {
		return ApiResponse.<T>builder().success(false).message(message).data(null).error(error).build();
	}
}
