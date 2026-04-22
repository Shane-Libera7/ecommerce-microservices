package com.ecommerce.orderservice;

public class RabbitMQConstants {
    public static final String EXCHANGE = "order.exchange";
    public static final String QUEUE_INVENTORY = "order.inventory.update";
    public static final String QUEUE_NOTIFICATION = "order.notification";
    public static final String ROUTING_KEY = "order.placed";
}
