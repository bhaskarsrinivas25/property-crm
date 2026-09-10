package com.propertycrm.dto;

import com.propertycrm.entity.FollowUpStatus;
import com.propertycrm.entity.FollowUpType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FollowUpResponse {

    private Long id;
    private String customerName;
    private String customerPhone;
    private LocalDate followUpDate;
    private FollowUpType type;
    private FollowUpStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FollowUpResponse(
            Long id,
            String customerName,
            String customerPhone,
            LocalDate followUpDate,
            FollowUpType type,
            FollowUpStatus status,
            String notes,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.followUpDate = followUpDate;
        this.type = type;
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

    public LocalDate getFollowUpDate() {
        return followUpDate;
    }

    public FollowUpType getType() {
        return type;
    }

    public FollowUpStatus getStatus() {
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