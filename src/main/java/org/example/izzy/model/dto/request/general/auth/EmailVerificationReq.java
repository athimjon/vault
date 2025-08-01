package org.example.izzy.model.dto.request.general.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EmailVerificationReq(
        @NotBlank(message = "Phone Number is required!")
        @Pattern(regexp = "^\\+998(90|91|93|94|50|55|87|88|97|95|99|77|98|33)\\d{7}$",
                message = "Phone number is in an invalid format, e.g., +998 90 123 45 67")
        String phoneNumber
) {

}
