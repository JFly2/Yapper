package com.yapper.backend.service;

import com.yapper.backend.model.Message;
import com.yapper.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository){
         this.messageRepository = messageRepository;
     }

     public Message saveMessage(Message message){
        message.setTimestamp(Instant.now());
        return messageRepository.save(message);
     }

     public List<Message> getMessagesByRoomId(Long roomId){
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId);
     }

}
