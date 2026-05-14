package com.onlinestsore.storebackend.repository;

import com.onlinestsore.storebackend.entity.Order;
import com.onlinestsore.storebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
