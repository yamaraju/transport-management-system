package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class BoardingPointRequest {
    @NotBlank
    private String name;

    @NotNull
    private LocalTime pickupTime;

    @NotNull
    private LocalTime dropTime;
}
