package com.commission.commission.controller;

import java.util.ArrayList; 

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.commission.commission.dto.CommissionCreateDto;
import com.commission.commission.dto.CommissionResponseDto;
import com.commission.commission.dto.CommissionSearchDto;
import com.commission.commission.service.CommissionService;
import com.commission.common.file.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/commissions")
public class CommissionController {

	private final CommissionService commissionService;
    private final FileService fileService;

    @PostMapping("/create")
    public CommissionResponseDto create(
    		Authentication auth,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") int price,
            @RequestParam("estimatedDays") int estimatedDays,
            @RequestParam("category") String category,
            
            @RequestParam(value = "files", required = false)
            List<MultipartFile> files,
            
            @RequestParam(value = "thumbnailIndex", required = false) 
    		Integer thumbnailIndex
    		
    ) throws Exception {

    	String username = auth.getName();
    	Long userId = (Long) auth.getPrincipal();
    	
        List<String> imageUrls = new ArrayList<>();

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
            	imageUrls.add(fileService.saveFile(file, "commission"));
            }
        }

        CommissionCreateDto dto = new CommissionCreateDto();
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setPrice(price);
        dto.setEstimatedDays(estimatedDays);
        dto.setCategory(category);

        return commissionService.create(userId, dto, imageUrls, thumbnailIndex);
    }
    
    @GetMapping("/{id}")
    public CommissionResponseDto getDetail(@PathVariable("id") Long id) {
        return commissionService.findById(id);
    }
    
    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws Exception {
    	return fileService.saveFile(file, "temp");
    }
    
    @GetMapping
    public ResponseEntity<?> getList(
            CommissionSearchDto cond,
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                commissionService.search(cond, pageable)
        );
    }
    
    @GetMapping("/my")
    public List<CommissionResponseDto>
    getMyCommissions(
            Authentication authentication
    ) {

        Long userId =
                (Long) authentication.getPrincipal();

        return commissionService
                .getMyCommissions(userId);
    }
    
    @DeleteMapping("/{id}")
    public void deleteCommission(
            @PathVariable("id") Long id,
            Authentication authentication
    ) {

        Long userId =
                (Long) authentication.getPrincipal();

        String role =
                authentication
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();

        commissionService.deleteCommission(
                id,
                userId,
                role
        );
    }
    
    @PatchMapping("/{id}/toggle")
    public void toggle(
            @PathVariable("id") Long id,
            Authentication auth
    ) {
        Long userId = (Long) auth.getPrincipal();

        commissionService.toggleStatus(
                id,
                userId
        );
    }
    
}
