package com.propertycrm.exception;

public class FollowUpNotFoundException extends RuntimeException {

    public FollowUpNotFoundException(Long id) {
        super("Follow-up not found with id: " + id);
    }
}