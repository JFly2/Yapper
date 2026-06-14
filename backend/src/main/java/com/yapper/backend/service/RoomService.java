package com.yapper.backend.service;

import com.yapper.backend.dto.CreateRoomRequest;
import com.yapper.backend.dto.RoomResponse;
import com.yapper.backend.model.Room;
import com.yapper.backend.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;

@Service
public class RoomService {
    private final static String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final static int JOIN_CODE_LENGTH = 6;
    private final static SecureRandom rand = new SecureRandom();
    private final RoomRepository roomRepository;

    public RoomService (RoomRepository roomRepository){
     this.roomRepository = roomRepository;
 }

 private RoomResponse convertToResponse (Room room){

        return new RoomResponse(
              room.getId(),
              room.getName(),
              room.getJoinCode(),
              room.isPublicRoom(),
              room.getCategory()
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

 public RoomResponse createRoom(CreateRoomRequest request){
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

        return convertToResponse(savedRoom);
 }

 public RoomResponse findByJoinCode(String joinCode){

        Room room = roomRepository.findByJoinCodeIgnoreCase(joinCode.trim())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        return convertToResponse(room);
 }


}
