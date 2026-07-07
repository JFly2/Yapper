package com.yapper.backend.repository;


import com.yapper.backend.model.Room;
import com.yapper.backend.model.RoomMembership;
import com.yapper.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomMembershipRepository extends JpaRepository<RoomMembership, Long> {
    boolean existsByUserAndRoom(User user, Room room);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);
    Optional <RoomMembership> findByUserAndRoom(User user, Room room);
    List<RoomMembership> findByUser(User user);
    void deleteByRoom(Room room);


}
