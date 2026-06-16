package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MaintenanceRequest {
    @NotNull
    private Long busId;

    @NotBlank
    private String description;

    @NotNull
    private Double cost;

    @NotNull
    private LocalDate maintenanceDate;

    private LocalDate completionDate;
}
