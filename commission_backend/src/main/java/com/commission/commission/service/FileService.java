package com.commission.commission.service;

import java.io.File;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

	private final String uploadDir = "C:/uploads/"; 

    public String saveFile(MultipartFile file) throws Exception {

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        File dest = new File(uploadDir + fileName);
        file.transferTo(dest);

        return "/uploads/" + fileName;
    }
}
