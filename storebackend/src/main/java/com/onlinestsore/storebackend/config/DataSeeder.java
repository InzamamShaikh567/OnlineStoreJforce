package com.onlinestsore.storebackend.config;

import com.onlinestsore.storebackend.entity.*;
import com.onlinestsore.storebackend.repository.OrderRepository;
import com.onlinestsore.storebackend.repository.ProductRepository;
import com.onlinestsore.storebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed admin account
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@store.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAdmin(true);
            userRepository.save(admin);
        }

        // Seed products only if none exist
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                // Electronics
                createProduct("Bluetooth Speaker", "Portable wireless speaker with deep bass and 12-hour battery life. Water-resistant for outdoor use.", 39.99, Category.ELECTRONICS, "https://via.placeholder.com/150"),
                createProduct("USB-C Cable", "Fast charging USB-C cable, 6ft length, durable braided design. Compatible with all USB-C devices.", 12.99, Category.ELECTRONICS, "https://via.placeholder.com/150"),
                createProduct("Wireless Mouse", "Ergonomic wireless mouse with silent click and adjustable DPI. 2.4GHz stable connection.", 24.99, Category.ELECTRONICS, "https://via.placeholder.com/150"),

                // Clothing
                createProduct("Cotton T-Shirt", "Soft and breathable 100% cotton t-shirt. Regular fit, available in multiple colors.", 19.99, Category.CLOTHING, "https://via.placeholder.com/150"),
                createProduct("Denim Jeans", "Classic straight fit denim jeans with 5-pocket styling. Durable and comfortable for everyday wear.", 49.99, Category.CLOTHING, "https://via.placeholder.com/150"),
                createProduct("Winter Jacket", "Warm and lightweight winter jacket with water-resistant outer layer. Perfect for cold weather.", 89.99, Category.CLOTHING, "https://via.placeholder.com/150"),

                // Home & Kitchen
                createProduct("Coffee Maker", "12-cup drip coffee maker with auto shut-off and reusable filter. Brews fresh coffee in minutes.", 34.99, Category.HOME_KITCHEN, "https://via.placeholder.com/150"),
                createProduct("Non-stick Pan", "10-inch non-stick frying pan with durable coating. Easy to clean and oven safe up to 400F.", 29.99, Category.HOME_KITCHEN, "https://via.placeholder.com/150"),
                createProduct("LED Desk Lamp", "Adjustable LED desk lamp with 3 brightness levels and USB charging port. Eye-friendly lighting.", 27.99, Category.HOME_KITCHEN, "https://via.placeholder.com/150"),

                // Sports
                createProduct("Yoga Mat", "6mm thick yoga mat with non-slip surface. Includes carrying strap. Eco-friendly material.", 22.99, Category.SPORTS, "https://via.placeholder.com/150"),
                createProduct("Running Shoes", "Lightweight running shoes with cushioned sole and breathable mesh upper. Ideal for daily runs.", 69.99, Category.SPORTS, "https://via.placeholder.com/150"),
                createProduct("Dumbbells (5kg)", "Set of 2x 5kg dumbbells with hexagonal shape to prevent rolling. Vinyl coated for durability.", 34.99, Category.SPORTS, "https://via.placeholder.com/150")
            );
            productRepository.saveAll(products);
        }
    }

    private Product createProduct(String name, String description, double price, Category category, String imageUrl) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        return p;
    }
}