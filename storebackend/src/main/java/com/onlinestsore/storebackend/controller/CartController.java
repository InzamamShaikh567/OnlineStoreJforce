package com.onlinestsore.storebackend.controller;

import com.onlinestsore.storebackend.dto.CartItemRequest;
import com.onlinestsore.storebackend.dto.CartItemResponse;
import com.onlinestsore.storebackend.entity.User;
import com.onlinestsore.storebackend.repository.UserRepository;
import com.onlinestsore.storebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(@RequestHeader("X-User-Id") Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CartItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cartService.addToCart(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponse> updateQuantity(@PathVariable Long id, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.noContent().build();
    }
}