package com.tms.services;

import com.tms.dto.MaintenanceRequest;
import com.tms.exceptions.ResourceNotFoundException;
import com.tms.models.Bus;
import com.tms.models.MaintenanceRecord;
import com.tms.repositories.BusRepository;
import com.tms.repositories.MaintenanceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRecordRepository maintenanceRecordRepository;

    @Autowired
    private BusRepository busRepository;

    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceRecordRepository.findAll();
    }

    public List<MaintenanceRecord> getRecordsByBus(Long busId) {
        return maintenanceRecordRepository.findByBusId(busId);
    }

    public MaintenanceRecord getRecordById(Long id) {
        return maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with ID: " + id));
    }

    @Transactional
    public MaintenanceRecord logRecord(MaintenanceRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + request.getBusId()));

        MaintenanceRecord record = MaintenanceRecord.builder()
                .bus(bus)
                .description(request.getDescription())
                .cost(request.getCost())
                .maintenanceDate(request.getMaintenanceDate())
                .completionDate(request.getCompletionDate())
                .build();

        return maintenanceRecordRepository.save(record);
    }

    @Transactional
    public MaintenanceRecord updateCompletionDate(Long id, java.time.LocalDate completionDate) {
        MaintenanceRecord record = getRecordById(id);
        record.setCompletionDate(completionDate);
        return maintenanceRecordRepository.save(record);
    }
}
