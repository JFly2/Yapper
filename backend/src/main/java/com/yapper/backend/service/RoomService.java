package com.yapper.backend.service;

import com.yapper.backend.dto.CreateRoomRequest;
import com.yapper.backend.dto.JoinedRoomResponse;
import com.yapper.backend.dto.RoomMemberResponse;
import com.yapper.backend.dto.RoomResponse;
import com.yapper.backend.model.Room;
import com.yapper.backend.model.RoomMembership;
import com.yapper.backend.model.User;
import com.yapper.backend.repository.MessageRepository;
import com.yapper.backend.repository.RoomMembershipRepository;
import com.yapper.backend.repository.RoomRepository;
import com.yapper.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {
    private final static String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final static int JOIN_CODE_LENGTH = 6;
    private final static SecureRandom rand = new SecureRandom();
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomMembershipRepository roomMembershipRepository;
    private final MessageRepository messageRepository;

    public RoomService (RoomRepository roomRepository, UserRepository userRepository, RoomMembershipRepository roomMembershipRepository, MessageRepository messageRepository){
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.roomMembershipRepository = roomMembershipRepository;
        this.messageRepository = messageRepository;
    }

 private RoomResponse toRoomResponse(Room room){

        return new RoomResponse(
              room.getId(),
              room.getName(),
              room.getJoinCode(),
              room.isPublicRoom(),
              room.getCategory()
        );
 }

 private JoinedRoomResponse toJoinedRoomResponse(RoomMembership membership){
        Room room = membership.getRoom();

        return new JoinedRoomResponse(
                room.getId(),
                room.getName(),
                room.getJoinCode(),
                room.isPublicRoom(),
                room.getCategory(),
                membership.getRole()
        );
 }

 private RoomMemberResponse toRoomMemberResponse(RoomMembership membership){

        User user = membership.getUser();

        return new RoomMemberResponse(
                user.getId(),
                user.getUsername(),
                membership.getRole(),
                membership.getJoinedAt()
        );
 }

 public String generateJoinCode(){

     StringBuilder code = new StringBuilder();

     for (int i = 0; i < JOIN_CODE_LENGTH; i++){
        int index = rand.nextInt(CHARACTERS.length());
        code.append(CHARACTERS.charAt(index));
     }

      return code.toString();
 }

 private String generateUniqueJoinCode(){
        String code;

        do {
            code = generateJoinCode();
        } while (roomRepository.existsByJoinCode(code));

        return code;
 }

 @Transactional
 public JoinedRoomResponse createRoom(CreateRoomRequest request, String username){
        String roomName = request.name() == null || request.name().isBlank()
                ? "Untitled Room" : request.name().trim();

        String category = request.category() == null || request.category().isBlank()
                ? null : request.category().trim();

        Room room = new Room();

        room.setName(roomName);
        room.setJoinCode(generateUniqueJoinCode());
        room.setPublicRoom(request.publicRoom());
        room.setCategory(category);

        Room savedRoom = roomRepository.save(room);

        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException("User not found: " + username);
        }

        RoomMembership membership = new RoomMembership();
        membership.setUser(user);
        membership.setRoom(savedRoom);
        membership.setRole(RoomMembership.RoomRole.OWNER);
        membership.setJoinedAt(Instant.now());


       RoomMembership savedMembership = roomMembershipRepository.save(membership);


        return toJoinedRoomResponse(savedMembership);
 }

 public RoomResponse findByJoinCode(String joinCode){

        Room room = roomRepository.findByJoinCodeIgnoreCase(joinCode.trim())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        return toRoomResponse(room);
 }

 @Transactional
public RoomResponse joinRoom(String joinCode, String username){
        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException(
                    "User not found: " + username
            );
        }

        Room room = roomRepository.findByJoinCodeIgnoreCase(joinCode.trim()).orElse(null);

        if (room == null){
            throw new IllegalArgumentException(
                    "Room not found for join code: " + joinCode
            );
        }

        boolean alreadyJoined = roomMembershipRepository.existsByUserAndRoom(user,room);

        if (!alreadyJoined){
            RoomMembership membership = new RoomMembership();

           membership.setUser(user);
           membership.setRoom(room);

           membership.setRole(RoomMembership.RoomRole.MEMBER);
           membership.setJoinedAt(Instant.now());
           roomMembershipRepository.save(membership);
        }

        return toRoomResponse(room);
 }


 @Transactional(readOnly = true)
    public List<JoinedRoomResponse> getJoinedRooms(String username){
        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException(
                    "User not found " + username
            );
        }

      List<RoomMembership> memberships = roomMembershipRepository.findByUser(user);

        List<JoinedRoomResponse> responses = new ArrayList<>();

        for (RoomMembership membership: memberships){
            JoinedRoomResponse response = toJoinedRoomResponse(membership);
            responses.add(response);
        }

        return responses;
    }

    @Transactional
    public void leaveRoom(Long roomId, String username){
        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException("User not found: " + username);
        }

        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));

        RoomMembership membership = roomMembershipRepository
                .findByUserAndRoom(user, room)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of this room"));

        if (membership.getRole() == RoomMembership.RoomRole.OWNER) {
            throw new AccessDeniedException("Room owner cannot leave room. Delete the room instead");
        }

        roomMembershipRepository.delete(membership);
    }

    @Transactional
    public void deleteRoom(Long roomId, String username){
        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException("User not found: " + username);
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Room not found " + roomId
                        )
                );

        RoomMembership membership = roomMembershipRepository.findByUserAndRoom(user, room).orElseThrow(
                () -> new AccessDeniedException("You are not a member of this room")
        );

        if (membership.getRole() != RoomMembership.RoomRole.OWNER){
            throw new AccessDeniedException("Only the room owner can delete this room");
        }

        messageRepository.deleteByRoomId(roomId);
        roomMembershipRepository.deleteByRoom(room);
        roomRepository.delete(room);
    }

    @Transactional(readOnly = true)
    public List<RoomMemberResponse> getRoomMembers(Long roomId, String username){
        User user = userRepository.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException("User not found: " + username);
        }

        Room room = roomRepository.findById(roomId).orElseThrow(
                ()-> new EntityNotFoundException("Room not found " + roomId)
        );

       roomMembershipRepository.findByUserAndRoom(user, room).orElseThrow(()
               -> new AccessDeniedException("You are not a member of this room"));


        List<RoomMembership> memberships = roomMembershipRepository.findByRoom(room);

        List<RoomMemberResponse> responses = new ArrayList<>();

        for (RoomMembership membership: memberships){
            RoomMemberResponse response = toRoomMemberResponse(membership);
            responses.add(response);
        }
        return responses;
    }

    @Transactional
    public void kickMember(Long roomId, Long targetUserId, String ownerUsername){
        User owner = userRepository.findByUsername(ownerUsername);

        if (owner == null) throw new UsernameNotFoundException("User not found " + ownerUsername);

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Room not found: " + roomId));

        RoomMembership ownerMembership = roomMembershipRepository.findByUserAndRoom(owner, room)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this room"));

        if (ownerMembership.getRole() != RoomMembership.RoomRole.OWNER){
            throw new AccessDeniedException("Only the room owner can kick members");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + targetUserId));

        RoomMembership targetMembership = roomMembershipRepository.findByUserAndRoom(targetUser, room)
                .orElseThrow(() -> new EntityNotFoundException("User is not in room"));

        if (targetMembership.getRole() == RoomMembership.RoomRole.OWNER){
            throw new AccessDeniedException("Owner cannot be kicked");
        }

        roomMembershipRepository.delete(targetMembership);
    }

}
