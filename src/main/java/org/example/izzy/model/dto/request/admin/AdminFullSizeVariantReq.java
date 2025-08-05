package org.example.izzy.model.dto.request.admin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.example.izzy.model.enums.Size;

import java.util.UUID;

public record AdminFullSizeVariantReq(
        @NotNull(message = "Size must be selected!")
        Size size,

        @NotNull(message = "Quantity must be set")
        @PositiveOrZero(message = "Quantity cannot be negative but can be 0 or more" )
        Integer quantity,

        @NotNull(message = "ColourVariantId must not be null!")
        UUID colourVariantId
) {
}
