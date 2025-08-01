package org.example.izzy.service.interfaces.general.auth;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.example.izzy.model.dto.request.general.auth.CodeVerificationReq;
import org.example.izzy.model.dto.request.general.auth.LoginReq;
import org.example.izzy.model.dto.request.general.auth.RegisterReq;
import org.example.izzy.model.dto.response.general.AuthResponse;
import org.example.izzy.model.dto.response.general.UserRes;

public interface AuthService {

    void logInUser(@Valid LoginReq loginReq);

    UserRes verifyBothRegisterAndLogin(
            @Valid CodeVerificationReq codeVerificationReq,
            HttpServletResponse response
    );

    void register(@Valid RegisterReq registerReq);
}
