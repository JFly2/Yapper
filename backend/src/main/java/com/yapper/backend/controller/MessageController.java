package com.yapper.backend.controller;

import com.yapper.backend.model.Message;
import com.yapper.backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:63342")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping
    public Message saveMessage(@RequestBody Message message, Authentication authentication){

        String sender = authentication.getName();

        message.setSender(sender);

        return messageService.saveMessage(message);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<List<Message>> getMessagesByRoomId(@PathVariable Long roomId){
         return ResponseEntity.ok(messageService.getMessagesByRoomId(roomId));
    }

    @GetMapping("/test")
    public String test(Authentication authentication){

        return authentication.getName();
    }

}
