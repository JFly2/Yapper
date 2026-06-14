package com.yapper.backend.controller;

import com.yapper.backend.dto.CreateRoomRequest;
import com.yapper.backend.dto.RoomResponse;
import com.yapper.backend.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController (RoomService roomService){
        this.roomService = roomService;
    }


    @PostMapping
    public ResponseEntity<RoomResponse> createRoom (@RequestBody CreateRoomRequest request){
            RoomResponse room = roomService.createRoom(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @GetMapping("/code/{joinCode}")
    public ResponseEntity<RoomResponse> findByJoinCode(@PathVariable String joinCode){
        return ResponseEntity.ok(roomService.findByJoinCode(joinCode));
    }


}
