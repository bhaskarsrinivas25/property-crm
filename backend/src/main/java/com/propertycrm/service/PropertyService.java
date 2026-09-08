package com.propertycrm.service;

import com.propertycrm.dto.PropertyRequest;
import com.propertycrm.dto.PropertyResponse;
import com.propertycrm.entity.Property;
import com.propertycrm.exception.PropertyNotFoundException;
import com.propertycrm.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        Property property = new Property();
        applyRequest(property, request);
        return toResponse(propertyRepository.save(property));
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        return toResponse(findProperty(id));
    }

    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyRequest request) {
        Property property = findProperty(id);
        applyRequest(property, request);
        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = findProperty(id);
        propertyRepository.delete(property);
    }

    private Property findProperty(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException(id));
    }

    private void applyRequest(Property property, PropertyRequest request) {
        property.setTitle(request.getTitle());
        property.setPropertyType(request.getPropertyType());
        property.setListingType(request.getListingType());
        property.setLocation(request.getLocation());
        property.setAddress(request.getAddress());
        property.setPrice(request.getPrice());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setArea(request.getArea());
        property.setDescription(request.getDescription());
        property.setStatus(request.getStatus());
        property.setOwnerName(request.getOwnerName());
        property.setOwnerPhone(request.getOwnerPhone());
    }

    private PropertyResponse toResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setPropertyType(property.getPropertyType());
        response.setListingType(property.getListingType());
        response.setLocation(property.getLocation());
        response.setAddress(property.getAddress());
        response.setPrice(property.getPrice());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setArea(property.getArea());
        response.setDescription(property.getDescription());
        response.setStatus(property.getStatus());
        response.setOwnerName(property.getOwnerName());
        response.setOwnerPhone(property.getOwnerPhone());
        response.setCreatedAt(property.getCreatedAt());
        response.setUpdatedAt(property.getUpdatedAt());
        return response;
    }
}
