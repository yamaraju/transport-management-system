package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull
    private Long registrationId;

    @NotNull
    private Double amount;

    @NotBlank
    private String paymentMethod; // CARD, NET_BANKING, UPI
}
