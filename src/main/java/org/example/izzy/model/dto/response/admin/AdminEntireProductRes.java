package org.example.izzy.model.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.example.izzy.model.enums.Gender;
import org.example.izzy.model.enums.ProductStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AdminEntireProductRes(
        UUID id,
        String name,
        Integer price,
        Integer discount,
        Gender gender,
        ProductStatus status,
        String description,

        UUID categoryId,
        String categoryName,

        Integer colours,

        List<AdminEntireColourVariantRes> colourVariants,

        Boolean isActive,


        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime updatedAt,

        String createdBy,
        String updatedBy
) {
}
