package com.ecommerce.orderservice;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        RabbitAdmin admin = new RabbitAdmin(connectionFactory);
        admin.setAutoStartup(true);
        return admin;
    }

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(RabbitMQConstants.EXCHANGE);
    }

    @Bean
    public Queue inventoryQueue() {
        return new Queue(RabbitMQConstants.QUEUE_INVENTORY);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(RabbitMQConstants.QUEUE_NOTIFICATION);
    }

    @Bean
    public Binding inventoryBinding(Queue inventoryQueue, DirectExchange orderExchange) {
        return BindingBuilder
                .bind(inventoryQueue)
                .to(orderExchange)
                .with(RabbitMQConstants.ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, DirectExchange orderExchange) {
        return BindingBuilder
                .bind(notificationQueue)
                .to(orderExchange)
                .with(RabbitMQConstants.ROUTING_KEY);
    }
}