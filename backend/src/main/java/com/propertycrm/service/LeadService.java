package com.propertycrm.service;

import com.propertycrm.dto.LeadRequest;
import com.propertycrm.dto.LeadResponse;
import com.propertycrm.entity.Lead;
import com.propertycrm.exception.LeadNotFoundException;
import com.propertycrm.repository.LeadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @Transactional
    public LeadResponse createLead(LeadRequest request) {
        Lead lead = new Lead();
        applyRequest(lead, request);
        return toResponse(leadRepository.save(lead));
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeadResponse getLeadById(Long id) {
        return toResponse(findLead(id));
    }

    @Transactional
    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead lead = findLead(id);
        applyRequest(lead, request);
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public void deleteLead(Long id) {
        Lead lead = findLead(id);
        leadRepository.delete(lead);
    }

    private Lead findLead(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new LeadNotFoundException(id));
    }

    private void applyRequest(Lead lead, LeadRequest request) {
        lead.setName(request.getName());
        lead.setPhone(request.getPhone());
        lead.setEmail(request.getEmail());
        lead.setPropertyType(request.getPropertyType());
        lead.setRequirement(request.getRequirement());
        lead.setPreferredLocation(request.getPreferredLocation());
        lead.setBudget(request.getBudget());
        lead.setLeadSource(request.getLeadSource());
        lead.setStatus(request.getStatus());
        lead.setNotes(request.getNotes());
    }

    private LeadResponse toResponse(Lead lead) {
        LeadResponse response = new LeadResponse();
        response.setId(lead.getId());
        response.setName(lead.getName());
        response.setPhone(lead.getPhone());
        response.setEmail(lead.getEmail());
        response.setPropertyType(lead.getPropertyType());
        response.setRequirement(lead.getRequirement());
        response.setPreferredLocation(lead.getPreferredLocation());
        response.setBudget(lead.getBudget());
        response.setLeadSource(lead.getLeadSource());
        response.setStatus(lead.getStatus());
        response.setNotes(lead.getNotes());
        response.setCreatedAt(lead.getCreatedAt());
        response.setUpdatedAt(lead.getUpdatedAt());
        return response;
    }
}
