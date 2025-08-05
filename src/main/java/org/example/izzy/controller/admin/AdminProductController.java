package org.example.izzy.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.izzy.model.dto.request.admin.AdminProductReq;
import org.example.izzy.model.dto.response.admin.AdminEntireProductRes;
import org.example.izzy.model.dto.response.admin.AdminProductRes;
import org.example.izzy.service.interfaces.admin.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.example.izzy.constant.ApiConstant.*;

@Validated
@RestController
@RequestMapping(API + V1 + ADMIN + PRODUCT)
@RequiredArgsConstructor
public class AdminProductController {
    private final AdminProductService adminProductService;

    @PostMapping
    public ResponseEntity<AdminProductRes> createProductWithoutItsVariants(@Valid @RequestBody AdminProductReq adminProductReq) {
        AdminProductRes adminProductRes = adminProductService.createProductWithoutItsVariants(adminProductReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminProductRes);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<AdminProductRes> getOneProductWithoutItsVariants(@PathVariable UUID productId) {
        AdminProductRes productRes = adminProductService.getOneProductWithoutItsVariants(productId);
        return ResponseEntity.ok(productRes);
    }

    @GetMapping
    public ResponseEntity<List<AdminProductRes>> getAllProductsWithoutVariants() {
        List<AdminProductRes> productRes = adminProductService.getAllProductsWithoutVariants();
        return ResponseEntity.ok(productRes);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProductWithoutVariants(@PathVariable UUID productId, @Valid @RequestBody AdminProductReq adminProductReq) {
        AdminProductRes adminProductRes = adminProductService.updateProductWithoutVariants(productId, adminProductReq);
        return ResponseEntity.ok(adminProductRes);
    }


    @PatchMapping("/{productId}")
    public ResponseEntity<?> disableOrEnableProduct(@PathVariable UUID productId) {
        String message = adminProductService.disableOrEnableProduct(productId);
        return ResponseEntity.ok(message);
    }



    @GetMapping("/{productId}" + ENTIRE)
    public ResponseEntity<AdminEntireProductRes> getEntireProductWithVariants(@PathVariable UUID productId) {
        AdminEntireProductRes productRes = adminProductService.getEntireProductWithVariants(productId);
        return ResponseEntity.ok(productRes);
    }

    @GetMapping( ENTIRE)
    public ResponseEntity<List<AdminEntireProductRes>> getListOfEntireProductsWithVariants() {
        List<AdminEntireProductRes> productRes = adminProductService.getListOfEntireProductsWithVariants();
        return ResponseEntity.ok(productRes);
    }


}
