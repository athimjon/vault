package org.example.izzy.model.dto.response.general;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/*
400 Bad Request: Invalid input or validation errors.
401 Unauthorized: Authentication failure.
403 Forbidden: Authorization failure.
404 Not Found: Resource not found.
500 Internal Server Error: Unexpected server errors.
*/

public record ErrorResponse(
        Integer status,
        String message,
        String error,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime time,
        String path
) {

}
