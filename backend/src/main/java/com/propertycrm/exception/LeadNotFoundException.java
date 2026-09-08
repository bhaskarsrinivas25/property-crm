package com.propertycrm.exception;

public class LeadNotFoundException extends RuntimeException {

    public LeadNotFoundException(Long id) {
        super("Lead not found with id: " + id);
    }
}
