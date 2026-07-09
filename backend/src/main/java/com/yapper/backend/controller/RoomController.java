package com.yapper.backend.controller;

import com.yapper.backend.dto.CreateRoomRequest;
import com.yapper.backend.dto.JoinedRoomResponse;
import com.yapper.backend.dto.RoomMemberResponse;
import com.yapper.backend.dto.RoomResponse;
import com.yapper.backend.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController (RoomService roomService){
        this.roomService = roomService;
    }


    @PostMapping
    public ResponseEntity<JoinedRoomResponse> createRoom (@RequestBody CreateRoomRequest request, Authentication authentication){
            JoinedRoomResponse response = roomService.createRoom(request, authentication.getName());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/code/{joinCode}")
    public ResponseEntity<RoomResponse> findByJoinCode(@PathVariable String joinCode){
        return ResponseEntity.ok(roomService.findByJoinCode(joinCode));
    }

    @PostMapping("/code/{joinCode}")
    public ResponseEntity<RoomResponse> joinRoom(@PathVariable String joinCode, Authentication authentication){

        RoomResponse room = roomService.joinRoom(joinCode, authentication.getName());

        return ResponseEntity.ok(room);
    }


    @GetMapping("/joined")
    public ResponseEntity<List<JoinedRoomResponse>> getJoinedRooms (Authentication authentication){

        List<JoinedRoomResponse> rooms = roomService.getJoinedRooms(authentication.getName());

        return ResponseEntity.ok(rooms);
    }

    @DeleteMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(@PathVariable Long roomId, Authentication authentication){

        roomService.leaveRoom(roomId, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId, Authentication authentication){

        roomService.deleteRoom(roomId, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<List<RoomMemberResponse>> getRoomMembers(@PathVariable Long roomId, Authentication authentication){
        return ResponseEntity.ok(roomService.getRoomMembers(roomId, authentication.getName()));
    }

    @DeleteMapping("/{roomId}/members/{userId}")
    public ResponseEntity<Void> kickMember(@PathVariable Long roomId, @PathVariable Long userId, Authentication authentication){
        roomService.kickMember(roomId, userId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
