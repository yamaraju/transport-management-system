package com.tms.controllers;

import com.tms.dto.BusRequest;
import com.tms.models.Bus;
import com.tms.models.Seat;
import com.tms.services.BusService;
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
@RequestMapping("/api/buses")
public class BusController {

    @Autowired
    private BusService busService;

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createBus(@Valid @RequestBody BusRequest busRequest) {
        Bus bus = busService.createBus(busRequest);
        return ResponseEntity.ok(bus);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateBus(@PathVariable Long id, @Valid @RequestBody BusRequest busRequest) {
        Bus bus = busService.updateBus(id, busRequest);
        return ResponseEntity.ok(bus);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bus deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<Seat>> getBusSeats(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusSeats(id));
    }

    @PutMapping("/{id}/seats/{seatId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateSeatStatus(
            @PathVariable Long id,
            @PathVariable Long seatId,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        busService.updateSeatStatus(id, seatId, status);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Seat status updated successfully");
        return ResponseEntity.ok(response);
    }
}
