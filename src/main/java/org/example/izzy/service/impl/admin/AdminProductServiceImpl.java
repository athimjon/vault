package org.example.izzy.service.impl.admin;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.izzy.exception.ResourceNotFoundException;
import org.example.izzy.mapper.ProductMapper;
import org.example.izzy.model.dto.request.admin.AdminProductReq;
import org.example.izzy.model.dto.response.admin.AdminEntireProductRes;
import org.example.izzy.model.dto.response.admin.AdminProductRes;
import org.example.izzy.model.entity.Product;
import org.example.izzy.repo.ProductRepository;
import org.example.izzy.service.interfaces.admin.AdminProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class
AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;


    @Override
    public AdminProductRes createProductWithoutItsVariants(AdminProductReq adminProductReq) {
        Product product = productMapper.toEntity(adminProductReq);
        return productMapper.toAdminProductRes(productRepository.save(product));
    }

    @Override
    public AdminProductRes getOneProductWithoutItsVariants(UUID productId) {
        return productMapper.toAdminProductRes(findProductFromDB(productId));
    }


    @Override
    public List<AdminProductRes> getAllProductsWithoutVariants() {
        List<Product> products = productRepository.findAll();
        return productMapper.toAdminProductResList(products);
    }


    @Override
    @Transactional
    public AdminProductRes updateProductWithoutVariants(UUID productId, AdminProductReq adminProductReq) {
        Product productFromDB = findProductFromDB(productId);
        productMapper.updateProductFromAdminProductReq(adminProductReq, productFromDB);
        return productMapper.toAdminProductRes(productFromDB);
    }

    @Transactional
    @Override
    public String disableOrEnableProduct(UUID productId) {
        Product productFromDB = findProductFromDB(productId);
        Boolean isActive = productFromDB.getIsActive();
        productFromDB.setIsActive(!isActive);
        return "Product " + (productFromDB.getIsActive() ? "ACTIVATED✅" : "DEACTIVATED🚫");
    }

    @Override
    public AdminEntireProductRes getEntireProductWithVariants(UUID productId) {
        Product productFromDB = findProductFromDB(productId);
        return productMapper.toAdminEntireProductRes(productFromDB);
    }

    @Override
    public List<AdminEntireProductRes> getListOfEntireProductsWithVariants() {
        List<Product> products = productRepository.findAll();
        return productMapper.toAdminEntireProductResList(products);
    }


    private Product findProductFromDB(UUID productId) {
        return productRepository.findById(productId).orElseThrow(() ->
                new ResourceNotFoundException("Product not found with ID: " + productId));
    }
}
