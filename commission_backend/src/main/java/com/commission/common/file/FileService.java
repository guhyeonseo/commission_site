package com.commission.common.file;

import java.io.File;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    public String saveFile(MultipartFile file, String type) throws Exception {

        String uploadDir = "C:/uploads/" + type + "/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String original = file.getOriginalFilename();
        if (original == null) {
            throw new RuntimeException("파일 이름 없음");
        }

        String fileName = UUID.randomUUID() + "_" + original;

        File dest = new File(uploadDir + fileName);
        file.transferTo(dest);

        return "/uploads/" + type + "/" + fileName;
    }
    
    public void deleteFile(String filePath) {
        if (filePath == null) return;

        File file = new File("C:" + filePath);
        if (file.exists()) {
            file.delete();
        }
    }
}