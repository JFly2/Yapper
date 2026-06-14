package com.yapper.backend.repository;

import com.yapper.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByJoinCodeIgnoreCase(String joinCode);
    boolean existsByJoinCode(String joinCode);
}
