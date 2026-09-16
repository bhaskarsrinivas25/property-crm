package com.propertycrm.service;

import com.propertycrm.dto.SiteVisitRequest;
import com.propertycrm.dto.SiteVisitResponse;
import com.propertycrm.entity.SiteVisit;
import com.propertycrm.exception.SiteVisitNotFoundException;
import com.propertycrm.repository.SiteVisitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteVisitService {

    private final SiteVisitRepository siteVisitRepository;

    public SiteVisitService(SiteVisitRepository siteVisitRepository) {
        this.siteVisitRepository = siteVisitRepository;
    }

    public SiteVisitResponse createSiteVisit(SiteVisitRequest request) {
        SiteVisit siteVisit = new SiteVisit();

        siteVisit.setCustomerName(request.getCustomerName());
        siteVisit.setCustomerPhone(request.getCustomerPhone());
        siteVisit.setProperty(request.getProperty());
        siteVisit.setVisitDate(request.getVisitDate());
        siteVisit.setVisitTime(request.getVisitTime());
        siteVisit.setStatus(request.getStatus());
        siteVisit.setNotes(request.getNotes());

        SiteVisit savedSiteVisit = siteVisitRepository.save(siteVisit);

        return mapToResponse(savedSiteVisit);
    }

    public List<SiteVisitResponse> getAllSiteVisits() {
        return siteVisitRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SiteVisitResponse getSiteVisitById(Long id) {
        SiteVisit siteVisit = siteVisitRepository.findById(id)
                .orElseThrow(() -> new SiteVisitNotFoundException(id));

        return mapToResponse(siteVisit);
    }

    public SiteVisitResponse updateSiteVisit(Long id, SiteVisitRequest request) {
        SiteVisit siteVisit = siteVisitRepository.findById(id)
                .orElseThrow(() -> new SiteVisitNotFoundException(id));

        siteVisit.setCustomerName(request.getCustomerName());
        siteVisit.setCustomerPhone(request.getCustomerPhone());
        siteVisit.setProperty(request.getProperty());
        siteVisit.setVisitDate(request.getVisitDate());
        siteVisit.setVisitTime(request.getVisitTime());
        siteVisit.setStatus(request.getStatus());
        siteVisit.setNotes(request.getNotes());

        SiteVisit updatedSiteVisit = siteVisitRepository.save(siteVisit);

        return mapToResponse(updatedSiteVisit);
    }

    public void deleteSiteVisit(Long id) {
        SiteVisit siteVisit = siteVisitRepository.findById(id)
                .orElseThrow(() -> new SiteVisitNotFoundException(id));

        siteVisitRepository.delete(siteVisit);
    }

    private SiteVisitResponse mapToResponse(SiteVisit siteVisit) {
        return new SiteVisitResponse(
                siteVisit.getId(),
                siteVisit.getCustomerName(),
                siteVisit.getCustomerPhone(),
                siteVisit.getProperty(),
                siteVisit.getVisitDate(),
                siteVisit.getVisitTime(),
                siteVisit.getStatus(),
                siteVisit.getNotes(),
                siteVisit.getCreatedAt(),
                siteVisit.getUpdatedAt()
        );
    }
}