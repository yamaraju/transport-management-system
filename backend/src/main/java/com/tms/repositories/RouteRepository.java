package com.tms.repositories;

import com.tms.models.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByRouteNumber(String routeNumber);
    Boolean existsByRouteNumber(String routeNumber);
}
