package com.tms.services;

import com.tms.dto.BoardingPointRequest;
import com.tms.dto.RouteRequest;
import com.tms.exceptions.BadRequestException;
import com.tms.exceptions.ResourceNotFoundException;
import com.tms.models.BoardingPoint;
import com.tms.models.Route;
import com.tms.repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));
    }

    @Transactional
    public Route createRoute(RouteRequest routeRequest) {
        if (routeRepository.existsByRouteNumber(routeRequest.getRouteNumber())) {
            throw new BadRequestException("Route number already exists: " + routeRequest.getRouteNumber());
        }

        Route route = Route.builder()
                .routeNumber(routeRequest.getRouteNumber())
                .origin(routeRequest.getOrigin())
                .destination(routeRequest.getDestination())
                .distance(routeRequest.getDistance())
                .fare(routeRequest.getFare())
                .boardingPoints(new ArrayList<>())
                .build();

        for (BoardingPointRequest bpReq : routeRequest.getBoardingPoints()) {
            BoardingPoint bp = BoardingPoint.builder()
                    .name(bpReq.getName())
                    .pickupTime(bpReq.getPickupTime())
                    .dropTime(bpReq.getDropTime())
                    .route(route)
                    .build();
            route.getBoardingPoints().add(bp);
        }

        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Long id, RouteRequest routeRequest) {
        Route route = getRouteById(id);

        if (!route.getRouteNumber().equals(routeRequest.getRouteNumber()) && 
            routeRepository.existsByRouteNumber(routeRequest.getRouteNumber())) {
            throw new BadRequestException("Route number already exists: " + routeRequest.getRouteNumber());
        }

        route.setRouteNumber(routeRequest.getRouteNumber());
        route.setOrigin(routeRequest.getOrigin());
        route.setDestination(routeRequest.getDestination());
        route.setDistance(routeRequest.getDistance());
        route.setFare(routeRequest.getFare());

        route.getBoardingPoints().clear();
        for (BoardingPointRequest bpReq : routeRequest.getBoardingPoints()) {
            BoardingPoint bp = BoardingPoint.builder()
                    .name(bpReq.getName())
                    .pickupTime(bpReq.getPickupTime())
                    .dropTime(bpReq.getDropTime())
                    .route(route)
                    .build();
            route.getBoardingPoints().add(bp);
        }

        return routeRepository.save(route);
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route route = getRouteById(id);
        routeRepository.delete(route);
    }

    public long countRoutes() {
        return routeRepository.count();
    }
}
