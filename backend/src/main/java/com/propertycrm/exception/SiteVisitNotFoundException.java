package com.propertycrm.exception;

public class SiteVisitNotFoundException extends RuntimeException {

    public SiteVisitNotFoundException(Long id) {
        super("Site visit not found with id: " + id);
    }
}