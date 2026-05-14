package com.onlinestsore.storebackend.dto;

import com.onlinestsore.storebackend.entity.Category;
import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Category category;
    private String imageUrl;
}
