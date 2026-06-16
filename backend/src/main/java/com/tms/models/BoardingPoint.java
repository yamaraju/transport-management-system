package com.tms.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "boarding_points")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "route")
public class BoardingPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private LocalTime pickupTime;

    @NotNull
    @Column(nullable = false)
    private LocalTime dropTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @JsonBackReference
    private Route route;
}
