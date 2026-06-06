package com.yapper.backend.security;

import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Component;


@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustUserDetailsService custUserDetailsService;

    public WebSocketAuthInterceptor (JwtService jwtService, CustUserDetailsService custUserDetailsService){
        this.jwtService = jwtService;
        this.custUserDetailsService = custUserDetailsService;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ){
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())){
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")){
                String token = authHeader.substring(7);
                String username = jwtService.extractUsername(token);
                UserDetails user = custUserDetailsService.loadUserByUsername(username);


                if (jwtService.isTokenValid(token, user)){
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    accessor.setUser(authToken);
                }
            }
        }

        return message;
    }

}
