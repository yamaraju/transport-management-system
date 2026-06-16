package com.tms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotNull
    private Long routeId;

    @NotNull
    private Long boardingPointId;

    @NotNull
    private Long busId;

    @NotNull
    private Long seatId;
}
