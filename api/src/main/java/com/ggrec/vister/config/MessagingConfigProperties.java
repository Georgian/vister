package com.ggrec.vister.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "messaging")
@Getter @Setter
public class MessagingConfigProperties {

    private String queue;
    private String exchange;
    private String routingKey;

}
