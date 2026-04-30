package com.ecommerce.orderservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name="item_list")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false)
    private Long orderId;


    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false)
    private Long priceAtPurchase;

    //Getters

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public Long getQuantity() {
        return quantity;
    }

    public Long getPriceAtPurchase() {
        return priceAtPurchase;
    }
}
