package com.yapper.backend.controller;

import com.yapper.backend.model.Message;
import com.yapper.backend.service.MessageService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping
    public Message saveMessageForUser(@RequestBody Message message, Authentication authentication){
        return messageService.saveMessageForUser(message, authentication.getName());
    }

    @GetMapping("/{roomId}")
    public List<Message> getMessagesByRoomIdForUser(@PathVariable Long roomId, Authentication authentication){
        return messageService.getMessagesByRoomIdForUser(roomId, authentication.getName());
    }

    @GetMapping("/test")
    public String test(Authentication authentication){
        return authentication.getName();
    }

}
