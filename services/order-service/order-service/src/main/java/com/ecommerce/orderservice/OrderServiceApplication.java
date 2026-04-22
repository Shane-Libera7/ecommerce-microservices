package com.ecommerce.orderservice;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);

    }

    @Bean
    public CommandLineRunner testRabbitConnection(RabbitTemplate rabbitTemplate) {
        return args -> {
            System.out.println("Testing RabbitMQ connection...");
            rabbitTemplate.getConnectionFactory().createConnection();
            System.out.println("RabbitMQ connected successfully!");
        };

}}
