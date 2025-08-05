package org.example.izzy.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.izzy.model.dto.request.admin.AdminColourVariantWithNoSizesReq;
import org.example.izzy.model.dto.request.admin.AdminEntireColourVariantReq;
import org.example.izzy.model.dto.response.admin.AdminColourVariantRes;
import org.example.izzy.model.dto.response.admin.AdminEntireColourVariantRes;
import org.example.izzy.service.interfaces.admin.AdminColourVariantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.example.izzy.constant.ApiConstant.*;

@RestController
@RequestMapping(API + V1 + ADMIN + COLOUR_VARIANT)
@RequiredArgsConstructor
public class AdminColourVariantController {

    private final AdminColourVariantService adminColourVariantService;

    @PostMapping(ENTIRE)
    public ResponseEntity<AdminEntireColourVariantRes> createEntireColourVariant(@Valid @RequestBody AdminEntireColourVariantReq colourVariantReq) {
        AdminEntireColourVariantRes adminColourVariantRes = adminColourVariantService.createEntireColourVariant(colourVariantReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminColourVariantRes);
    }
//TEMPORARILY  DISABLED GETTING COLOUR_VARIANT BY PRODUCT_ID ENDPOINT
//    @GetMapping(BY_PRODUCT + "/{productId}")
//    public ResponseEntity<List<AdminEntireColourVariantRes>> getEntireColourVariantsByProductId(@PathVariable UUID productId) {
//        List<AdminEntireColourVariantRes> colourVariantRes = adminColourVariantService.getEntireColourVariantsByProductId(productId);
//        return ResponseEntity.ok(colourVariantRes);
//    }

    @GetMapping("/{colourVariantId}"+ENTIRE)
    public ResponseEntity<AdminEntireColourVariantRes> getOneEntireColourVariant(@PathVariable UUID colourVariantId) {
        AdminEntireColourVariantRes colourVariantRes = adminColourVariantService.getOneEntireColourVariant(colourVariantId);
        return ResponseEntity.ok(colourVariantRes);
    }

    @PutMapping("/{colourVariantId}")
    public ResponseEntity<AdminColourVariantRes> updateColourVariant(@PathVariable UUID colourVariantId, @Valid @RequestBody AdminColourVariantWithNoSizesReq colourVariantReq) {
        AdminColourVariantRes colourVariantRes = adminColourVariantService.updateColourVariant(colourVariantId, colourVariantReq);
        return ResponseEntity.ok(colourVariantRes);
    }


    @PatchMapping("/{colourVariantId}")
    public ResponseEntity<String> activateOrDeactivateColourVariant(@PathVariable UUID colourVariantId) {
        String message = adminColourVariantService.activateOrDeactivateColourVariant(colourVariantId);
        return ResponseEntity.ok("ColourVariant  " + message);
    }

//TEMPORARILY  DISABLED DELETING ENDPOINT
//    @DeleteMapping("/{colourVariantId}")
//    public ResponseEntity<Void> deleteColourVariantWithSizes(@PathVariable UUID colourVariantId) {
//        adminColourVariantService.deleteColourVariantWithSizes(colourVariantId);
//        return ResponseEntity.noContent().build();
//    }


}
