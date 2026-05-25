package com.cts.scheme.serviceImpl;

import com.cts.scheme.dto.SchemeRequestDTO;
import com.cts.scheme.dto.SchemeResponseDTO;
import com.cts.scheme.dto.SchemeStatusUpdateDTO;
import com.cts.scheme.exception.BadRequestException;
import com.cts.scheme.exception.ResourceNotFoundException;
import com.cts.scheme.mapper.SchemeMapper;
import com.cts.scheme.model.Scheme;
import com.cts.scheme.repository.SchemeRepository;
import com.cts.scheme.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeServiceImpl implements SchemeService {

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private SchemeMapper schemeMapper;

    @Override
    public List<SchemeResponseDTO> getAllSchemes() {
        return schemeRepository.findAll()
                .stream()
                .map(schemeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SchemeResponseDTO createScheme(SchemeRequestDTO dto) {
        Scheme scheme = schemeMapper.toEntity(dto);
        Scheme saved = schemeRepository.save(scheme);
        return schemeMapper.toDto(saved);
    }

    @Override
    public SchemeResponseDTO getSchemeById(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with ID: " + id));
        return schemeMapper.toDto(scheme);
    }

    @Override
    public SchemeResponseDTO updateSchemeStatus(Long id, SchemeStatusUpdateDTO dto) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with ID: " + id));

        String newStatus = dto.getStatus().toUpperCase();
        if (!newStatus.equals("ACTIVE") && !newStatus.equals("INACTIVE")) {
            throw new BadRequestException("Invalid status '" + dto.getStatus() + "'. Allowed values: ACTIVE, INACTIVE.");
        }

        scheme.setStatus(newStatus);
        Scheme saved = schemeRepository.save(scheme);
        return schemeMapper.toDto(saved);
    }

    @Override
    public void deleteScheme(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with ID: " + id));
        schemeRepository.delete(scheme);
    }
}
