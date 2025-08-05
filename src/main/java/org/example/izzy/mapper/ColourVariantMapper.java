package org.example.izzy.mapper;

import org.example.izzy.mapper.helper.AttachmentMapperHelper;
import org.example.izzy.mapper.helper.ColourVariantMapperHelper;
import org.example.izzy.mapper.helper.GeneralMapperHelper;
import org.example.izzy.model.dto.request.admin.AdminColourVariantWithNoSizesReq;
import org.example.izzy.model.dto.request.admin.AdminEntireColourVariantReq;
import org.example.izzy.model.dto.response.admin.AdminColourVariantRes;
import org.example.izzy.model.dto.response.admin.AdminEntireColourVariantRes;
import org.example.izzy.model.entity.ColourVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {
        GeneralMapperHelper.class,
        AttachmentMapperHelper.class,
        ColourVariantMapperHelper.class,
        SizeVariantMapper.class,
        ColourVariantMapperHelper.class
})
public interface ColourVariantMapper {

    @Mapping(source = "productId", target = "product", qualifiedByName = "mapProductIdToProduct")
    @Mapping(source = "imageIds", target = "images", qualifiedByName = "mapAttachmentIdsToAttachments")
    ColourVariant toEntity(AdminEntireColourVariantReq colourVariantReq);




    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "images", target = "imageUrls", qualifiedByName = "mapAttachmentsToUrls")
    @Mapping(source = "images", target = "imageIds", qualifiedByName = "mapAttachmentsToIds")
    AdminColourVariantRes toAdminColourVariantRes(ColourVariant savedEntity);

    List<AdminColourVariantRes> toAdminColourVariantResList(List<ColourVariant> colourVariantResList);

    @Mapping(source = "imageIds", target = "images", qualifiedByName = "mapAttachmentIdsToAttachments")
    @Mapping(source = "productId", target = "product", qualifiedByName = "mapProductIdToProduct")
    void updateColourVariantFromColourVariantReq(AdminColourVariantWithNoSizesReq colourVariantReq, @MappingTarget ColourVariant colourVariant);


    //    ENTIRE RESPONSES
    @Mapping(source = "images", target = "images", qualifiedByName = "countAttachments")
    @Mapping(source = "images", target = "imageIds", qualifiedByName = "mapAttachmentsToIds")
    @Mapping(source = "images", target = "imageUrls", qualifiedByName = "mapAttachmentsToUrls")
    @Mapping(source = "sizeVariants", target = "sizes", qualifiedByName = "countSizeVariants")
    @Mapping(source = "sizeVariants", target = "stock", qualifiedByName = "calculateTotalStock")

    @Mapping(source = "product.id",target = "productId")
    @Mapping(source = "sizeVariants", target = "sizeVariants")
    AdminEntireColourVariantRes toAdminEntireColourVariantRes(ColourVariant colourVariant);

    List<AdminEntireColourVariantRes> toAdminEntireColourVariantResList(List<ColourVariant> colourVariants);

}
