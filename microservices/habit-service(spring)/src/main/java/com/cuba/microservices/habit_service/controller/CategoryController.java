package com.cuba.microservices.habit_service.controller;

import java.util.List;
import java.util.UUID;

import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;

import com.cuba.microservices.habit_service.dto.ApiResponse;
import com.cuba.microservices.habit_service.dto.CategoryRequestDTO;
import com.cuba.microservices.habit_service.dto.CategoryResponseDTO;
import com.cuba.microservices.habit_service.service.CategoryService;

@RestController
@RequestMapping("/categories")
public class CategoryController {

	private static final Logger log = LoggerFactory.getLogger(CategoryController.class);
	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

    // ====== Tạo category (lấy user từ header do Gateway gắn) ======
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> createCategory(
            @RequestBody CategoryRequestDTO request,
            @RequestHeader(name = "X-User-Id", required = true) String userId,
            @RequestHeader(name = "X-User-Email", required = true) String userEmail,
            @RequestHeader(name = "X-Profile-Complete", required = true) String profileComplete
    ) {
        // Log để ông kiểm tra Gateway đã gắn header chưa
        log.info("[CategoryController] create by userId={}, email={}, profileComplete={}",
                userId, userEmail, profileComplete);

        CategoryResponseDTO category = categoryService.createCategory(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", category));
    }
	

    // ====== Lấy tất cả (nếu muốn lọc theo user, truyền userId vào service) ======
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategories(
            @RequestHeader(name = "X-User-Id", required = true) String userId
    ) {
        log.info("[CategoryController] getAll by userId={}", userId);
        List<CategoryResponseDTO> categories = categoryService.getAllCategories(userId);
        return ResponseEntity.ok(ApiResponse.success("Fetched categories successfully", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> getCategoryById(
            @PathVariable UUID id,
            @RequestHeader(name = "X-User-Id", required = true) String userId
    ) {
        log.info("[CategoryController] getById id={}, userId={}", id, userId);
        CategoryResponseDTO category = categoryService.getCategoryById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Fetched category successfully", category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryRequestDTO request,
            @RequestHeader(name = "X-User-Id", required = true) String userId
    ) {
        log.info("[CategoryController] update id={}, userId={}", id, userId);
        CategoryResponseDTO category = categoryService.updateCategory(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable UUID id,
            @RequestHeader(name = "X-User-Id", required = true) String userId
    ) {
        log.info("[CategoryController] delete id={}, userId={}", id, userId);
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}