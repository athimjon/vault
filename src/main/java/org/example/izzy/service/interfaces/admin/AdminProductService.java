package org.example.izzy.service.interfaces.admin;

import org.example.izzy.model.dto.request.admin.AdminProductReq;
import org.example.izzy.model.dto.response.admin.AdminEntireProductRes;
import org.example.izzy.model.dto.response.admin.AdminProductRes;

import java.util.List;
import java.util.UUID;

public interface AdminProductService {

    AdminProductRes createProductWithoutItsVariants(AdminProductReq adminProductReq);

    AdminProductRes getOneProductWithoutItsVariants(UUID productId);

    List<AdminProductRes> getAllProductsWithoutItsVariants();

    AdminProductRes updateProductWithoutItsVariants(UUID productId, AdminProductReq adminProductReq);

    String disableOrEnableProduct(UUID productId);


    AdminEntireProductRes getEntireProductWithVariants(UUID productId);

    List<AdminEntireProductRes> getListOfEntireProductsWithVariants();
}
