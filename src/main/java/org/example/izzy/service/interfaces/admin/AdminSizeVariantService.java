package org.example.izzy.service.interfaces.admin;

import jakarta.validation.Valid;
import org.example.izzy.model.dto.request.admin.AdminFullSizeVariantReq;
import org.example.izzy.model.dto.request.admin.AdminSizeVariantReq;
import org.example.izzy.model.dto.response.admin.AdminSizeVariantRes;

import java.util.UUID;

public interface AdminSizeVariantService {
    AdminSizeVariantRes getOneSizeVariant(UUID sizeVariantId);

    AdminSizeVariantRes updateSizeVariant(UUID sizeVariantId, AdminSizeVariantReq sizeVariantReq);

    AdminSizeVariantRes createSizeVariant(AdminFullSizeVariantReq sizeVariantReq);
}
