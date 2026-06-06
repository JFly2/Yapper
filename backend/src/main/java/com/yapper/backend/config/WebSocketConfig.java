package com.yapper.backend.config;

import com.yapper.backend.security.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketConfig(WebSocketAuthInterceptor webSocketAuthInterceptor){
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration){
        registration.interceptors(webSocketAuthInterceptor);
    }

    public void configureMessageBroker (MessageBrokerRegistry registry){
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    public void registerStompEndpoints(StompEndpointRegistry registry){
    registry.addEndpoint("/ws").setAllowedOrigins( "http://localhost:63342",
            "http://localhost:3000",
            "http://localhost:5173"
    ).withSockJS();
    }
}
