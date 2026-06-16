package com.tms.services;

import com.tms.dto.RegistrationRequest;
import com.tms.exceptions.BadRequestException;
import com.tms.exceptions.ResourceNotFoundException;
import com.tms.models.*;
import com.tms.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BoardingPointRepository boardingPointRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public List<Registration> getRegistrationsByUser(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    public Registration getRegistrationById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));
    }

    @Transactional
    public Registration createRegistration(User user, RegistrationRequest regRequest) {
        boolean hasActiveReg = registrationRepository.existsByUserIdAndStatus(user.getId(), "PENDING") ||
                               registrationRepository.existsByUserIdAndStatus(user.getId(), "APPROVED");
        if (hasActiveReg) {
            throw new BadRequestException("You already have a PENDING or APPROVED registration.");
        }

        Route route = routeRepository.findById(regRequest.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        BoardingPoint boardingPoint = boardingPointRepository.findById(regRequest.getBoardingPointId())
                .orElseThrow(() -> new ResourceNotFoundException("Boarding point not found"));

        Bus bus = busRepository.findById(regRequest.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        Seat seat = seatRepository.findById(regRequest.getSeatId())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));

        if (!seat.getBus().getId().equals(bus.getId())) {
            throw new BadRequestException("Selected seat does not belong to the selected bus");
        }

        if (seat.getStatus().equals("ALLOCATED")) {
            throw new BadRequestException("Seat " + seat.getSeatNumber() + " is already booked.");
        }

        seat.setStatus("ALLOCATED");
        seatRepository.save(seat);

        Registration registration = Registration.builder()
                .user(user)
                .route(route)
                .boardingPoint(boardingPoint)
                .bus(bus)
                .seat(seat)
                .registrationDate(LocalDate.now())
                .status("PENDING")
                .build();

        return registrationRepository.save(registration);
    }

    @Transactional
    public Registration updateStatus(Long id, String status) {
        Registration registration = getRegistrationById(id);

        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            throw new BadRequestException("Invalid status. Must be APPROVED or REJECTED.");
        }

        if (registration.getStatus().equals(status)) {
            return registration;
        }

        registration.setStatus(status);

        if (status.equals("APPROVED")) {
            User user = registration.getUser();
            user.setRegistered(true);
            userRepository.save(user);
        } else {
            Seat seat = registration.getSeat();
            if (seat != null) {
                seat.setStatus("AVAILABLE");
                seatRepository.save(seat);
            }
            User user = registration.getUser();
            user.setRegistered(false);
            userRepository.save(user);
        }

        return registrationRepository.save(registration);
    }

    public long countRegistrations() {
        return registrationRepository.count();
    }
}
