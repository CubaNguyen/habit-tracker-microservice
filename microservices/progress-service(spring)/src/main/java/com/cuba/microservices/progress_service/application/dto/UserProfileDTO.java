package com.cuba.microservices.progress_service.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Integer id;
    private Integer user_id;
    private String full_name;
    private String avatar_url;
    private String bio;
    private String timezone; 
}
