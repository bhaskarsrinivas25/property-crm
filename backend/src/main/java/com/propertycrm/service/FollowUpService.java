package com.propertycrm.service;

import com.propertycrm.dto.FollowUpRequest;
import com.propertycrm.dto.FollowUpResponse;
import com.propertycrm.entity.FollowUp;
import com.propertycrm.exception.FollowUpNotFoundException;
import com.propertycrm.repository.FollowUpRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowUpService {

    private final FollowUpRepository followUpRepository;

    public FollowUpService(FollowUpRepository followUpRepository) {
        this.followUpRepository = followUpRepository;
    }

    public FollowUpResponse createFollowUp(FollowUpRequest request) {
        FollowUp followUp = new FollowUp();

        followUp.setCustomerName(request.getCustomerName());
        followUp.setCustomerPhone(request.getCustomerPhone());
        followUp.setFollowUpDate(request.getFollowUpDate());
        followUp.setType(request.getType());
        followUp.setStatus(request.getStatus());
        followUp.setNotes(request.getNotes());

        FollowUp savedFollowUp = followUpRepository.save(followUp);

        return mapToResponse(savedFollowUp);
    }

    public List<FollowUpResponse> getAllFollowUps() {
        return followUpRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FollowUpResponse getFollowUpById(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new FollowUpNotFoundException(id));

        return mapToResponse(followUp);
    }

    public FollowUpResponse updateFollowUp(Long id, FollowUpRequest request) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new FollowUpNotFoundException(id));

        followUp.setCustomerName(request.getCustomerName());
        followUp.setCustomerPhone(request.getCustomerPhone());
        followUp.setFollowUpDate(request.getFollowUpDate());
        followUp.setType(request.getType());
        followUp.setStatus(request.getStatus());
        followUp.setNotes(request.getNotes());

        FollowUp updatedFollowUp = followUpRepository.save(followUp);

        return mapToResponse(updatedFollowUp);
    }

    public void deleteFollowUp(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new FollowUpNotFoundException(id));

        followUpRepository.delete(followUp);
    }

    private FollowUpResponse mapToResponse(FollowUp followUp) {
        return new FollowUpResponse(
                followUp.getId(),
                followUp.getCustomerName(),
                followUp.getCustomerPhone(),
                followUp.getFollowUpDate(),
                followUp.getType(),
                followUp.getStatus(),
                followUp.getNotes(),
                followUp.getCreatedAt(),
                followUp.getUpdatedAt()
        );
    }
}