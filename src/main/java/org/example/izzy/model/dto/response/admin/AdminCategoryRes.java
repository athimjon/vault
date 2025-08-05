package org.example.izzy.model.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record AdminCategoryRes(
        UUID id,
        String name,

        UUID parentId,
        String parentName,

        UUID attachmentId,
        String attachmentUrl,

        Set<UUID> childrenIds,
        Set<String> childrenNames,

        Boolean isActive,

        String createdBy,
        String updatedBy,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime updatedAt
) {
}
