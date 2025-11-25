package com.cuba.microservices.habit_service.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;

import com.cuba.microservices.habit_service.dto.CategoryRequestDTO;
import com.cuba.microservices.habit_service.dto.CategoryResponseDTO;
import com.cuba.microservices.habit_service.entity.Category;
import com.cuba.microservices.habit_service.exception.CustomException;
import com.cuba.microservices.habit_service.repository.CategoryRepository;

@Service
@Transactional
public class CategoryService {
	private final CategoryRepository categoryRepository;
    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

    // Tạo category
    public CategoryResponseDTO createCategory(CategoryRequestDTO request, String userId) {
        log.info("[CategoryService] create by userId={}", userId);

        if (categoryRepository.existsByName(request.getName())) {
            throw new CustomException("Category name already exists", "CATEGORY_ALREADY_EXISTS");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        // Nếu entity có các field audit thì set vào đây
        // category.setCreatedBy(userId);

        try {
            Category saved = categoryRepository.save(category);
            return new CategoryResponseDTO(saved.getId(), saved.getName(), saved.getDescription());
        } catch (Exception e) {
            throw new CustomException("Failed to save category", "CATEGORY_SAVE_ERROR");
        }
    }

    // Lấy tất cả (nếu muốn lọc theo user thì đổi repository thành findByUserId(userId))
    public List<CategoryResponseDTO> getAllCategories(String userId) {
        log.info("[CategoryService] getAll by userId={}", userId);
        return categoryRepository.findAll().stream()
                .map(cat -> new CategoryResponseDTO(cat.getId(), cat.getName(), cat.getDescription()))
                .toList();
    }

    public CategoryResponseDTO getCategoryById(UUID id, String userId) {
        log.info("[CategoryService] getById id={}, userId={}", id, userId);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException("Category not found", "CATEGORY_NOT_FOUND"));

        // Nếu multi-tenant: check quyền sở hữu
        // if (!Objects.equals(category.getOwnerId(), userId)) throw new CustomException("Forbidden", "FORBIDDEN");

        return new CategoryResponseDTO(category.getId(), category.getName(), category.getDescription());
    }

    public CategoryResponseDTO updateCategory(UUID id, CategoryRequestDTO request, String userId) {
        log.info("[CategoryService] update id={}, userId={}", id, userId);
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException("Category not found", "CATEGORY_NOT_FOUND"));

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        // existing.setUpdatedBy(userId);

        try {
            Category updated = categoryRepository.save(existing);
            return new CategoryResponseDTO(updated.getId(), updated.getName(), updated.getDescription());
        } catch (Exception e) {
            throw new CustomException("Failed to update category", "CATEGORY_UPDATE_ERROR");
        }
    }

    public void deleteCategory(UUID id, String userId) {
        log.info("[CategoryService] delete id={}, userId={}", id, userId);
        if (!categoryRepository.existsById(id)) {
            throw new CustomException("Category not found", "CATEGORY_NOT_FOUND");
        }

        // Nếu multi-tenant: kiểm tra quyền ở đây

        try {
            categoryRepository.deleteById(id);
        } catch (Exception e) {
            throw new CustomException("Failed to delete category", "CATEGORY_DELETE_ERROR");
        }
    }
}