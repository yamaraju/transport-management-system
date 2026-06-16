package com.tms.config;

import com.tms.models.*;
import com.tms.repositories.BusRepository;
import com.tms.repositories.RouteRepository;
import com.tms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("adminpassword"))
                    .email("admin@tms.com")
                    .name("System Administrator")
                    .phone("+15550100")
                    .role(Role.ROLE_ADMIN)
                    .registered(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded admin user: admin / adminpassword");
        }

        if (routeRepository.count() == 0) {
            Route r1 = Route.builder()
                    .routeNumber("R101")
                    .origin("Campus A")
                    .destination("Downtown")
                    .distance(15.5)
                    .fare(50.0)
                    .boardingPoints(new ArrayList<>())
                    .build();

            BoardingPoint bp1 = BoardingPoint.builder()
                    .name("Central Plaza")
                    .pickupTime(LocalTime.of(7, 30))
                    .dropTime(LocalTime.of(17, 30))
                    .route(r1)
                    .build();

            BoardingPoint bp2 = BoardingPoint.builder()
                    .name("Metro Station")
                    .pickupTime(LocalTime.of(7, 45))
                    .dropTime(LocalTime.of(17, 15))
                    .route(r1)
                    .build();

            r1.getBoardingPoints().add(bp1);
            r1.getBoardingPoints().add(bp2);
            routeRepository.save(r1);

            Route r2 = Route.builder()
                    .routeNumber("R102")
                    .origin("Campus A")
                    .destination("Suburbs North")
                    .distance(25.0)
                    .fare(75.0)
                    .boardingPoints(new ArrayList<>())
                    .build();

            BoardingPoint bp3 = BoardingPoint.builder()
                    .name("Green Park Circle")
                    .pickupTime(LocalTime.of(7, 15))
                    .dropTime(LocalTime.of(17, 45))
                    .route(r2)
                    .build();

            r2.getBoardingPoints().add(bp3);
            routeRepository.save(r2);

            System.out.println("Seeded default routes: R101, R102");
        }

        if (busRepository.count() == 0) {
            Bus bus1 = Bus.builder()
                    .busNumber("BUS-001")
                    .capacity(40)
                    .model("Volvo Coach 9700")
                    .status("ACTIVE")
                    .seats(new ArrayList<>())
                    .build();

            for (int i = 1; i <= 40; i++) {
                Seat seat = Seat.builder()
                        .seatNumber("S" + i)
                        .status("AVAILABLE")
                        .bus(bus1)
                        .build();
                bus1.getSeats().add(seat);
            }
            busRepository.save(bus1);

            Bus bus2 = Bus.builder()
                    .busNumber("BUS-002")
                    .capacity(40)
                    .model("Scania Metro Cruiser")
                    .status("ACTIVE")
                    .seats(new ArrayList<>())
                    .build();

            for (int i = 1; i <= 40; i++) {
                Seat seat = Seat.builder()
                        .seatNumber("S" + i)
                        .status("AVAILABLE")
                        .bus(bus2)
                        .build();
                bus2.getSeats().add(seat);
            }
            busRepository.save(bus2);

            System.out.println("Seeded default buses: BUS-001, BUS-002 with 40 seats each");
        }
    }
}
