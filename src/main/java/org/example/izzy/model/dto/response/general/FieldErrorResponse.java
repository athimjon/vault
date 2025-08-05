package org.example.izzy.model.dto.response.general;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.Map;

public record FieldErrorResponse(
        String message,
        int status,
        String error,
        String path,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime timestamp,
        Map<String, String> fieldErrors
) {

}
