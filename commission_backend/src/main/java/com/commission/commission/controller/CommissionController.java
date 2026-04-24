package com.commission.commission.controller;

import java.util.ArrayList; 
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.commission.commission.dto.CommissionCreateDto;
import com.commission.commission.dto.CommissionResponseDto;
import com.commission.commission.service.CommissionService;
import com.commission.common.file.FileService;
import com.commission.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/commissions")
public class CommissionController {

	private final CommissionService commissionService;
	private final UserService userService;
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
    	Long userId = userService.getUserIdByUsername(username);
    	
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
    
    @GetMapping
    public List<CommissionResponseDto> getList() {
        return commissionService.getList();
    }
    
    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws Exception {
    	return fileService.saveFile(file, "temp");
    }
}
