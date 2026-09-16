package com.propertycrm.controller;

import com.propertycrm.dto.SiteVisitRequest;
import com.propertycrm.dto.SiteVisitResponse;
import com.propertycrm.service.SiteVisitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site-visits")
public class SiteVisitController {

    private final SiteVisitService siteVisitService;

    public SiteVisitController(SiteVisitService siteVisitService) {
        this.siteVisitService = siteVisitService;
    }

    @PostMapping
    public ResponseEntity<SiteVisitResponse> createSiteVisit(
            @Valid @RequestBody SiteVisitRequest request) {

        SiteVisitResponse response = siteVisitService.createSiteVisit(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SiteVisitResponse>> getAllSiteVisits() {

        return ResponseEntity.ok(siteVisitService.getAllSiteVisits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiteVisitResponse> getSiteVisitById(
            @PathVariable Long id) {

        return ResponseEntity.ok(siteVisitService.getSiteVisitById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SiteVisitResponse> updateSiteVisit(
            @PathVariable Long id,
            @Valid @RequestBody SiteVisitRequest request) {

        return ResponseEntity.ok(
                siteVisitService.updateSiteVisit(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSiteVisit(
            @PathVariable Long id) {

        siteVisitService.deleteSiteVisit(id);

        return ResponseEntity.noContent().build();
    }
}