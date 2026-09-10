package com.propertycrm.controller;

import com.propertycrm.dto.FollowUpRequest;
import com.propertycrm.dto.FollowUpResponse;
import com.propertycrm.service.FollowUpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-ups")
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    @PostMapping
    public ResponseEntity<FollowUpResponse> createFollowUp(
            @Valid @RequestBody FollowUpRequest request) {

        FollowUpResponse response = followUpService.createFollowUp(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<FollowUpResponse>> getAllFollowUps() {
        return ResponseEntity.ok(followUpService.getAllFollowUps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FollowUpResponse> getFollowUpById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                followUpService.getFollowUpById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowUpResponse> updateFollowUp(
            @PathVariable Long id,
            @Valid @RequestBody FollowUpRequest request) {

        return ResponseEntity.ok(
                followUpService.updateFollowUp(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowUp(
            @PathVariable Long id) {

        followUpService.deleteFollowUp(id);

        return ResponseEntity.noContent().build();
    }
}