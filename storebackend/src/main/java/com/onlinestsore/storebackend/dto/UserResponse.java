package com.onlinestsore.storebackend.dto;

import com.onlinestsore.storebackend.entity.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private boolean admin;

    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setAdmin(user.isAdmin());
        return response;
    }
}
