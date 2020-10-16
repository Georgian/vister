package com.ggrec.vister.service;

import com.ggrec.vister.config.MessagingConfigProperties;
import lombok.AllArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor(onConstructor_ = @Autowired)
public class MessagingService {

    private final AmqpTemplate amqpTemplate;
    private final MessagingConfigProperties messagingConfigProperties;

    public void sendFile(byte[] fileData, String fileType) {
        Message message = MessageBuilder.withBody(fileData).setHeader("ContentType", fileType).build();
        amqpTemplate.send(messagingConfigProperties.getExchange(), messagingConfigProperties.getRoutingKey(), message);
    }

}
