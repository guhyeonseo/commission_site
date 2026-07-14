package com.commission.common.file;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {

    private final Cloudinary cloudinary;

    public String saveFile(MultipartFile file, String type) throws IOException {

        Map<String, Object> uploadResult =
                cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", type
                        )
                );

        System.out.println(uploadResult);

        return uploadResult.get("secure_url").toString();
    }

    public void deleteFile(String fileUrl) {

        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            String publicId = fileUrl
                    .substring(fileUrl.indexOf("/upload/") + 8)
                    .replaceFirst("^v\\d+/", "")
                    .replaceFirst("\\.[^.]+$", "");

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        } catch (IOException e) {
            throw new RuntimeException("이미지 삭제 실패", e);
        }
    }
}