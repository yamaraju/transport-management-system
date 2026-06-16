package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RouteRequest {
    @NotBlank
    private String routeNumber;

    @NotBlank
    private String origin;

    @NotBlank
    private String destination;

    @NotNull
    private Double distance;

    @NotNull
    private Double fare;

    @NotEmpty
    private List<BoardingPointRequest> boardingPoints;
}
