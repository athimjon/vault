package org.example.izzy.controller.general.auth;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.example.izzy.model.dto.request.general.auth.CodeVerificationReq;
import org.example.izzy.model.dto.request.general.auth.LoginReq;
import org.example.izzy.model.dto.request.general.auth.RegisterReq;
import org.example.izzy.model.dto.response.general.AuthResponse;
import org.example.izzy.model.dto.response.general.UserRes;
import org.example.izzy.service.interfaces.general.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.example.izzy.constant.ApiConstant.*;

@RestController
@RequestMapping(API + V1 + AUTH)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(LOGIN)
    public ResponseEntity<Void> login(@Valid @RequestBody LoginReq loginReq) {
        authService.logInUser(loginReq);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping(REGISTER)
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterReq registerReq){
        authService.register(registerReq);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @PostMapping(VERIFY)
    public ResponseEntity<UserRes> verifyBothRegisterAndLogin(@Valid @RequestBody CodeVerificationReq codeVerificationReq, HttpServletResponse response
    ) {
        UserRes userRes = authService.verifyBothRegisterAndLogin(codeVerificationReq, response);
        return ResponseEntity.ok(userRes);
    }


}

