package org.example.izzy.controller.admin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.izzy.service.interfaces.admin.AdminAttachmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import static org.example.izzy.constant.ApiConstant.*;

@Slf4j
@Validated
@RestController
@RequestMapping(API + V1 + ADMIN + ATTACHMENT)
@RequiredArgsConstructor
public class AdminAttachmentController {


    private final AdminAttachmentService adminAttachmentService;

    @PostMapping
    public ResponseEntity<?> saveAttachment(@RequestParam("file") MultipartFile file) {
        log.warn("Saving A new FILE: {}", file.getOriginalFilename());
        UUID attachmentId = adminAttachmentService.saveAttachment(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachmentId);
    }

    @PutMapping("/{attachmentId}")
    public ResponseEntity<Void> updateAttachment(@PathVariable  UUID attachmentId, @RequestParam("file") MultipartFile file) {
        log.warn("Updating attachment with ID: {} with a new ATTACHMENT : {}", attachmentId, file.getOriginalFilename());
        adminAttachmentService.updateAttachment(attachmentId, file);
        return ResponseEntity.ok().build();
    }


}
