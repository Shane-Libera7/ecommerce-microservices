package com.ecommerce.orderservice.controller;


import com.ecommerce.orderservice.entity.Order;
import com.ecommerce.orderservice.entity.OrderItem;
import com.ecommerce.orderservice.model.OrderRequest;
import com.ecommerce.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import static java.math.BigDecimal.ZERO;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request, @RequestHeader("Authorization") String authHeader) {




        try{
            String token = authHeader.replace("Bearer ", "");
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Long userId = claims.get("userId", Long.class);
            for (OrderItem item : request.getItems()) {
                ResponseEntity<Map> response = restTemplate.getForEntity("http://localhost:3002/products/" + item.getProductId(), Map.class);

                Map<String, Object> product = response.getBody();

                //Get inventory from product
                int inventory = (Integer) product.get("inventory");

                //Check if enough stock
                if (inventory < item.getQuantity()) {
                    return ResponseEntity.badRequest().body("Insufficient inventory for product " + item.getProductId());
                }
            }
            //Create Order
            Order order = new Order();
            order.setUserId(userId);
            order.setStatus("PENDING");
            order.setCreatedAt(LocalDateTime.now());
            order.setTotalPrice(ZERO);

            Order savedOrder = orderRepository.save(order);

            return ResponseEntity.status(201).body(savedOrder);







        } catch (ResourceAccessException e) {
            return ResponseEntity.status(503).body("Product service unavailable");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

    }
}
