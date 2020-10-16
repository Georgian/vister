package com.ggrec.vister.config;

import lombok.AllArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor(onConstructor_ = @Autowired)
public class RabbitMQConfig {

    private final MessagingConfigProperties messagingConfigProperties;

    @Bean
    Queue queue() {
        return new Queue(messagingConfigProperties.getQueue(), false);
    }

    @Bean
    DirectExchange exchange() {
        return new DirectExchange(messagingConfigProperties.getExchange());
    }

    @Bean
    Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(messagingConfigProperties.getRoutingKey());
    }

}
