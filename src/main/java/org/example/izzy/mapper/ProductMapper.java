package org.example.izzy.mapper;

import org.example.izzy.mapper.helper.GeneralMapperHelper;
import org.example.izzy.mapper.helper.ProductMapperHelper;
import org.example.izzy.model.dto.request.admin.AdminProductReq;
import org.example.izzy.model.dto.response.admin.AdminEntireProductRes;
import org.example.izzy.model.dto.response.admin.AdminProductRes;
import org.example.izzy.model.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {
        GeneralMapperHelper.class,
        ProductMapperHelper.class,
        ColourVariantMapper.class})
public interface ProductMapper {

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = ".", target = "stock", qualifiedByName = "calculateStock")
    @Mapping(source = ".", target = "colours", qualifiedByName = "countColourVariants")
    @Mapping(source = ".", target = "sizes", qualifiedByName = "countSizeVariants")
    AdminProductRes toAdminProductRes(Product product);

    List<AdminProductRes> toAdminProductResList(List<Product> products);


    @Mapping(source = "categoryId", target = "category", qualifiedByName = "mapCategoryIdToCategory")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "colourVariants", ignore = true)
    Product toEntity(AdminProductReq adminProductReq);


    @Mapping(source = "categoryId", target = "category", qualifiedByName = "mapCategoryIdToCategory")
    void updateProductFromAdminProductReq(AdminProductReq adminProductReq, @MappingTarget Product productFromDB);

//ENTIRE RES

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = ".", target = "colours", qualifiedByName = "countColourVariants")
    @Mapping(source = "colourVariants", target = "colourVariants")
    AdminEntireProductRes toAdminEntireProductRes(Product productFromDB);

    List<AdminEntireProductRes> toAdminEntireProductResList(List<Product> products);
}
