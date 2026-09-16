package com.propertycrm.dto;

import com.propertycrm.entity.SiteVisitStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class SiteVisitRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must not exceed 100 characters")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    @Size(max = 20, message = "Customer phone must not exceed 20 characters")
    private String customerPhone;

    @NotBlank(message = "Property is required")
    @Size(max = 150, message = "Property must not exceed 150 characters")
    private String property;

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    @NotNull(message = "Visit time is required")
    private LocalTime visitTime;

    @NotNull(message = "Status is required")
    private SiteVisitStatus status;

    private String notes;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public LocalTime getVisitTime() {
        return visitTime;
    }

    public void setVisitTime(LocalTime visitTime) {
        this.visitTime = visitTime;
    }

    public SiteVisitStatus getStatus() {
        return status;
    }

    public void setStatus(SiteVisitStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}