package com.yapper.backend.controller;

import com.yapper.backend.model.Message;
import com.yapper.backend.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(MessageService messageService, SimpMessagingTemplate messagingTemplate){
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/yapper.send")
    public void sendMessage(Message message, Principal principal){


        message.setSender(principal.getName());

        Message savedMessage = messageService.saveMessage(message);

        messagingTemplate.convertAndSend(
              "/topic/room/" + savedMessage.getRoomId(), savedMessage
        );


    }

}
