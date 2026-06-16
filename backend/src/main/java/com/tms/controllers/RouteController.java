package com.tms.controllers;

import com.tms.dto.RouteRequest;
import com.tms.models.Route;
import com.tms.services.RouteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.getRouteById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createRoute(@Valid @RequestBody RouteRequest routeRequest) {
        Route route = routeService.createRoute(routeRequest);
        return ResponseEntity.ok(route);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteRequest routeRequest) {
        Route route = routeService.updateRoute(id, routeRequest);
        return ResponseEntity.ok(route);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Route deleted successfully");
        return ResponseEntity.ok(response);
    }
}
