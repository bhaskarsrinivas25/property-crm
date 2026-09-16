package com.propertycrm.dto;

import com.propertycrm.entity.SiteVisitStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class SiteVisitResponse {

    private Long id;
    private String customerName;
    private String customerPhone;
    private String property;
    private LocalDate visitDate;
    private LocalTime visitTime;
    private SiteVisitStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SiteVisitResponse(
            Long id,
            String customerName,
            String customerPhone,
            String property,
            LocalDate visitDate,
            LocalTime visitTime,
            SiteVisitStatus status,
            String notes,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.property = property;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getProperty() {
        return property;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public LocalTime getVisitTime() {
        return visitTime;
    }

    public SiteVisitStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}