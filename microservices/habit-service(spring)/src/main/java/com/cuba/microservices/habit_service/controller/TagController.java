package com.cuba.microservices.habit_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cuba.microservices.habit_service.dto.ApiResponse;
import com.cuba.microservices.habit_service.dto.TagRequestDTO;
import com.cuba.microservices.habit_service.dto.TagResponseDTO;
import com.cuba.microservices.habit_service.service.TagService;

@RestController
@RequestMapping("/tags")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    // 🧩 Tạo tag mới (có đọc header từ Gateway)
    @PostMapping
    public ResponseEntity<ApiResponse<TagResponseDTO>> createTag(
            @RequestBody TagRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = true) String userId,
            @RequestHeader(value = "X-User-Email", required = true) String userEmail
    ) {
        System.out.println("📩 [TagController] Header from Gateway → X-User-Id: " + userId + ", X-User-Email: " + userEmail);

        TagResponseDTO tag = tagService.createTag(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Tag created successfully", tag));
    }

    // 🧩 Lấy tất cả tag (có log header)
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponseDTO>>> getAllTags(
            @RequestHeader(value = "X-User-Id", required = true) String userId) {
        System.out.println("📩 [TagController] X-User-Id: " + userId);
        List<TagResponseDTO> tags = tagService.getAllTags(userId);
        return ResponseEntity.ok(ApiResponse.success("Fetched tags successfully", tags));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TagResponseDTO>> getTagById(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", required = true) String userId) {
        System.out.println("📩 [TagController] X-User-Id: " + userId);
        TagResponseDTO tag = tagService.getTagById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched tag successfully", tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", required = true) String userId) {
        System.out.println("📩 [TagController] X-User-Id: " + userId);
        tagService.deleteTag(id);
        return ResponseEntity.ok(ApiResponse.success("Tag deleted successfully", null));
    }
}