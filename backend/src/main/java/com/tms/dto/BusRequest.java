package com.tms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BusRequest {
    @NotBlank
    private String busNumber;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotBlank
    private String model;

    @NotBlank
    private String status; // ACTIVE, IN_MAINTENANCE
}
