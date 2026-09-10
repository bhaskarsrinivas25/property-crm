package com.propertycrm.dto;

import com.propertycrm.entity.FollowUpStatus;
import com.propertycrm.entity.FollowUpType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class FollowUpRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must not exceed 100 characters")
    private String customerName;

    @Size(max = 20, message = "Customer phone must not exceed 20 characters")
    private String customerPhone;

    @NotNull(message = "Follow-up date is required")
    private LocalDate followUpDate;

    @NotNull(message = "Follow-up type is required")
    private FollowUpType type;

    @NotNull(message = "Follow-up status is required")
    private FollowUpStatus status;

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

    public LocalDate getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(LocalDate followUpDate) {
        this.followUpDate = followUpDate;
    }

    public FollowUpType getType() {
        return type;
    }

    public void setType(FollowUpType type) {
        this.type = type;
    }

    public FollowUpStatus getStatus() {
        return status;
    }

    public void setStatus(FollowUpStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}