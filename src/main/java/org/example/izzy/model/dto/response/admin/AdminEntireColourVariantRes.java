package org.example.izzy.model.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AdminEntireColourVariantRes(
        UUID id,

        String colourName,

        Integer images,
        List<UUID> imageIds,
        List<String> imageUrls,

        Integer sizes,
        List<AdminSizeVariantRes> sizeVariants,

        UUID productId,

        Integer stock,
        Boolean isActive,


        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime updatedAt,

        String createdBy,
        String updatedBy
) {
}
