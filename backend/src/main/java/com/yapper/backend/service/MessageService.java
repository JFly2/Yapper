package com.yapper.backend.service;

import com.yapper.backend.model.Message;
import com.yapper.backend.model.User;
import com.yapper.backend.repository.MessageRepository;
import com.yapper.backend.repository.RoomMembershipRepository;
import com.yapper.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final RoomMembershipRepository roomMembershipRepository;

    public MessageService(MessageRepository messageRepository, RoomMembershipRepository roomMembershipRepository, UserRepository userRepository){
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.roomMembershipRepository = roomMembershipRepository;
    }

     public Message saveMessageForUser(Message message, String username){
       User user = userRepository.findByUsername(username);

         if (user == null){
             throw new UsernameNotFoundException("User not found: " + username);
         }

       if(!roomMembershipRepository.existsByUserIdAndRoomId(user.getId(), message.getRoomId())){
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a member of this room");
       }

       message.setSender(username);
       message.setTimestamp(Instant.now());

       return messageRepository.save(message);
     }

     public List<Message> getMessagesByRoomIdForUser(Long roomId, String username){
        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException("User not found: " + username);
        }

        if (!roomMembershipRepository.existsByUserIdAndRoomId(user.getId(), roomId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a member of this room");
        }
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId);
     }



}
