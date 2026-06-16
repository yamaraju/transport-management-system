package com.tms.services;

import com.tms.dto.BusRequest;
import com.tms.exceptions.BadRequestException;
import com.tms.exceptions.ResourceNotFoundException;
import com.tms.models.Bus;
import com.tms.models.Seat;
import com.tms.repositories.BusRepository;
import com.tms.repositories.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + id));
    }

    @Transactional
    public Bus createBus(BusRequest busRequest) {
        if (busRepository.existsByBusNumber(busRequest.getBusNumber())) {
            throw new BadRequestException("Bus number already exists: " + busRequest.getBusNumber());
        }

        Bus bus = Bus.builder()
                .busNumber(busRequest.getBusNumber())
                .capacity(busRequest.getCapacity())
                .model(busRequest.getModel())
                .status(busRequest.getStatus())
                .seats(new ArrayList<>())
                .build();

        bus = busRepository.save(bus);

        // Pre-allocate seats based on capacity
        for (int i = 1; i <= bus.getCapacity(); i++) {
            Seat seat = Seat.builder()
                    .seatNumber("S" + i)
                    .status("AVAILABLE")
                    .bus(bus)
                    .build();
            bus.getSeats().add(seat);
        }

        return busRepository.save(bus);
    }

    @Transactional
    public Bus updateBus(Long id, BusRequest busRequest) {
        Bus bus = getBusById(id);

        if (!bus.getBusNumber().equals(busRequest.getBusNumber()) && 
            busRepository.existsByBusNumber(busRequest.getBusNumber())) {
            throw new BadRequestException("Bus number already exists: " + busRequest.getBusNumber());
        }

        int originalCapacity = bus.getCapacity();
        bus.setBusNumber(busRequest.getBusNumber());
        bus.setModel(busRequest.getModel());
        bus.setStatus(busRequest.getStatus());
        bus.setCapacity(busRequest.getCapacity());

        if (bus.getCapacity() > originalCapacity) {
            for (int i = originalCapacity + 1; i <= bus.getCapacity(); i++) {
                Seat seat = Seat.builder()
                        .seatNumber("S" + i)
                        .status("AVAILABLE")
                        .bus(bus)
                        .build();
                bus.getSeats().add(seat);
            }
        } else if (bus.getCapacity() < originalCapacity) {
            for (int i = originalCapacity; i > bus.getCapacity(); i--) {
                final String seatNum = "S" + i;
                Seat seat = bus.getSeats().stream()
                        .filter(s -> s.getSeatNumber().equals(seatNum))
                        .findFirst()
                        .orElse(null);

                if (seat != null) {
                    if (seat.getStatus().equals("ALLOCATED")) {
                        throw new BadRequestException("Cannot shrink bus capacity. Seat " + seatNum + " is currently allocated.");
                    }
                    bus.getSeats().remove(seat);
                }
            }
        }

        return busRepository.save(bus);
    }

    @Transactional
    public void deleteBus(Long id) {
        Bus bus = getBusById(id);
        busRepository.delete(bus);
    }

    public List<Seat> getBusSeats(Long busId) {
        getBusById(busId);
        return seatRepository.findByBusId(busId);
    }

    @Transactional
    public void updateSeatStatus(Long busId, Long seatId, String status) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + seatId));
        if (!seat.getBus().getId().equals(busId)) {
            throw new BadRequestException("Seat does not belong to the specified bus");
        }
        seat.setStatus(status);
        seatRepository.save(seat);
    }

    public long countBuses() {
        return busRepository.count();
    }
}
