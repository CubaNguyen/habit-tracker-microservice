package com.cuba.microservices.habit_service.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.habit_service.dto.TagRequestDTO;
import com.cuba.microservices.habit_service.dto.TagResponseDTO;
import com.cuba.microservices.habit_service.entity.Tag;
import com.cuba.microservices.habit_service.exception.CustomException;
import com.cuba.microservices.habit_service.repository.TagRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class TagService {
	private final TagRepository tagRepository;

	public TagService(TagRepository tagRepository) {
		this.tagRepository = tagRepository;
	}

	// Tạo tag
    public TagResponseDTO createTag(TagRequestDTO request, String userId) {
        System.out.println("👤 [TagService] User " + userId + " is creating tag: " + request.getName());

        if (tagRepository.existsByName(request.getName())) {
            throw new CustomException("Tag name already exists", "TAG_ALREADY_EXISTS");
        }

        Tag tag = new Tag();
        tag.setName(request.getName());
        // Nếu model Tag có userId thì set luôn:
        // tag.setUserId(Long.parseLong(userId));

        try {
            Tag saved = tagRepository.save(tag);
            return new TagResponseDTO(saved.getId(), saved.getName());
        } catch (Exception e) {
            throw new CustomException("Failed to save tag", "TAG_SAVE_ERROR");
        }
    }

    public List<TagResponseDTO> getAllTags(String userId) {
        System.out.println("👤 [TagService] Fetching tags for user: " + userId);
        return tagRepository.findAll()
                .stream()
                .map(tag -> new TagResponseDTO(tag.getId(), tag.getName()))
                .toList();
    }
	// Lấy tag theo id
	public TagResponseDTO getTagById(UUID id) {

		try {
			Tag tag = tagRepository.findById(id)
					.orElseThrow(() -> new CustomException("Tag not found", "TAG_NOT_FOUND"));
			return new TagResponseDTO(tag.getId(), tag.getName());
		} catch (Exception e) {
			throw new CustomException("Failed to get tag by id", "TAG_GET_ERROR");
		}
	}

	// Xóa tag
	public void deleteTag(UUID id) {
		if (!tagRepository.existsById(id)) {
			throw new CustomException("Tag not found", "TAG_NOT_FOUND");
		}
		try {
			tagRepository.deleteById(id);
		} catch (Exception e) {
			throw new CustomException("Failed to delete tag", "TAG_DELETE_ERROR");
		}
	}
}
