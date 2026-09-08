package com.propertycrm.repository;

import com.propertycrm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}
