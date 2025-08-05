package org.example.izzy.model.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.example.izzy.model.enums.Gender;
import org.example.izzy.model.enums.ProductStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminProductRes(
        UUID id,
        String name,
        Integer price,
        Integer discount,
        Gender gender,
        ProductStatus status,
        String description,
        UUID categoryId,
        String categoryName,
        Integer stock,
        Integer colours,
        Integer sizes,

        Boolean isActive,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime updatedAt,

        String createdBy,
        String updatedBy

) {
}
