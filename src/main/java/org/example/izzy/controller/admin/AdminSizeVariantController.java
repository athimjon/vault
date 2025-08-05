package org.example.izzy.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.izzy.model.dto.request.admin.AdminFullSizeVariantReq;
import org.example.izzy.model.dto.request.admin.AdminSizeVariantReq;
import org.example.izzy.model.dto.response.admin.AdminSizeVariantRes;
import org.example.izzy.service.interfaces.admin.AdminSizeVariantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static org.example.izzy.constant.ApiConstant.*;

@RestController
@RequestMapping(API + V1 + ADMIN + SIZE_VARIANT)
@RequiredArgsConstructor
public class AdminSizeVariantController {

    private final AdminSizeVariantService adminSizeVariantService;

    @PostMapping
    public ResponseEntity<AdminSizeVariantRes> createSizeVariant(@Valid @RequestBody AdminFullSizeVariantReq sizeVariantReq) {
        AdminSizeVariantRes sizeVariantRes = adminSizeVariantService.createSizeVariant(sizeVariantReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(sizeVariantRes);
    }

    @GetMapping("/{sizeVariantId}")
    public ResponseEntity<AdminSizeVariantRes> getOneSizeVariant(@PathVariable UUID sizeVariantId) {
        AdminSizeVariantRes sizeVariantRes = adminSizeVariantService.getOneSizeVariant(sizeVariantId);
        return ResponseEntity.ok(sizeVariantRes);
    }

    @PutMapping("/{sizeVariantId}")
    public ResponseEntity<AdminSizeVariantRes> updateSizeVariant(@PathVariable UUID sizeVariantId, @Valid @RequestBody AdminSizeVariantReq sizeVariantReq) {
        AdminSizeVariantRes sizeVariantRes = adminSizeVariantService.updateSizeVariant(sizeVariantId, sizeVariantReq);
        return ResponseEntity.ok(sizeVariantRes);
    }
}
