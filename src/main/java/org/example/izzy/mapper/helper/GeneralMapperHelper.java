package org.example.izzy.mapper.helper;

import lombok.RequiredArgsConstructor;
import org.example.izzy.exception.ResourceNotFoundException;
import org.example.izzy.model.entity.Category;
import org.example.izzy.model.entity.ColourVariant;
import org.example.izzy.model.entity.Product;
import org.example.izzy.repo.CategoryRepository;
import org.example.izzy.repo.ColourVariantRepository;
import org.example.izzy.repo.ProductRepository;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GeneralMapperHelper {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ColourVariantRepository colourVariantRepository;

    @Named("mapParentIdToCategory")
    public Category mapParentIdToCategory(UUID parentId) {
        if (parentId == null) {
            return null;
        }
        return categoryRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent Category with ID " + parentId + " not found!"));
    }

    @Named("mapCategoryIdToCategory")
    public Category mapCategoryIdToCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + categoryId + " not found!"));
    }

    @Named("mapProductIdToProduct")
    public Product mapProductIdToProduct(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID: " + productId + " not found!"));
    }
    @Named("mapColourVariantIdToColourVariant")
    public ColourVariant mapColourVariantIdToColourVariant(UUID colourVariantId) {
        return colourVariantRepository.findById(colourVariantId)
                .orElseThrow(() -> new ResourceNotFoundException("ColourVariant with ID: " + colourVariantId + " not found!"));
    }



}
