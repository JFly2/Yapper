package com.yapper.backend.config;

import com.yapper.backend.security.WebSocketAuthInterceptor;
import org.springframework.beans.factory.annotation.Value;
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
    private final String frontendUrl;

    public WebSocketConfig(WebSocketAuthInterceptor webSocketAuthInterceptor, @Value("${frontend.url}")
    String frontendUrl){
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
        this.frontendUrl = frontendUrl;
    }


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration){
        registration.interceptors(webSocketAuthInterceptor);
    }

    @Override
    public void configureMessageBroker (MessageBrokerRegistry registry){
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
    registry.addEndpoint("/ws").setAllowedOrigins( "http://localhost:63342",
            "http://localhost:3000",
            "http://localhost:5173",
            frontendUrl
    ).withSockJS();
    }
}
