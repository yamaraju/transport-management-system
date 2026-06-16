package com.tms.repositories;

import com.tms.models.BoardingPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardingPointRepository extends JpaRepository<BoardingPoint, Long> {
    List<BoardingPoint> findByRouteId(Long routeId);
}
