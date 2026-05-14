package com.onlinestsore.storebackend.service;

import com.onlinestsore.storebackend.dto.ProductRequest;
import com.onlinestsore.storebackend.dto.ProductResponse;
import com.onlinestsore.storebackend.entity.Category;
import com.onlinestsore.storebackend.entity.Product;
import com.onlinestsore.storebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts(String category, String search) {
        List<Product> products;

        if (search != null && !search.isBlank()) {
            if (category != null && !category.isBlank()) {
                Category cat = Category.valueOf(category.toUpperCase());
                products = productRepository.findByCategoryAndNameContainingIgnoreCase(cat, search);
            } else {
                products = productRepository.findByNameContainingIgnoreCase(search);
            }
        } else if (category != null && !category.isBlank()) {
            Category cat = Category.valueOf(category.toUpperCase());
            products = productRepository.findByCategory(cat);
        } else {
            products = productRepository.findAll();
        }

        return products.stream().map(ProductResponse::from).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductResponse.from(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        return ProductResponse.from(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        return ProductResponse.from(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
