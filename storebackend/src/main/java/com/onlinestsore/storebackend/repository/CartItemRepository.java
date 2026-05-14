package com.onlinestsore.storebackend.repository;

import com.onlinestsore.storebackend.entity.CartItem;
import com.onlinestsore.storebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct_Id(User user, Long productId);
    void deleteByUser(User user);
}
