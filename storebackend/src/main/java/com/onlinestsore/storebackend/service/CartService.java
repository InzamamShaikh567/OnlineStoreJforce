package com.onlinestsore.storebackend.service;

import com.onlinestsore.storebackend.dto.CartItemRequest;
import com.onlinestsore.storebackend.dto.CartItemResponse;
import com.onlinestsore.storebackend.entity.CartItem;
import com.onlinestsore.storebackend.entity.Product;
import com.onlinestsore.storebackend.entity.User;
import com.onlinestsore.storebackend.repository.CartItemRepository;
import com.onlinestsore.storebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItemResponse> getCart(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());
    }

    public CartItemResponse addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        var existing = cartItemRepository.findByUserAndProduct_Id(user, product.getId());
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return CartItemResponse.from(cartItemRepository.save(item));
        }

        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());
        return CartItemResponse.from(cartItemRepository.save(item));
    }

    public CartItemResponse updateQuantity(Long id, int quantity) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return CartItemResponse.from(cartItemRepository.save(item));
    }

    public void removeFromCart(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    public List<CartItem> getCartItems(User user) {
        return cartItemRepository.findByUser(user);
    }
}
