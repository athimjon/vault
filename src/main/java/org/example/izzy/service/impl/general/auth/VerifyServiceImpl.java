package org.example.izzy.service.impl.general.auth;

import lombok.RequiredArgsConstructor;
import org.example.izzy.service.interfaces.general.auth.VerifyService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerifyServiceImpl implements VerifyService {


//
//    public void sendVerificationCode(@Valid EmailVerificationReq phoneNumber) {
//        Verification.creator(
//                smsServiceSID,
//                phoneNumber.phoneNumber(),
//                "sms"  // or "call" if you want voice OTP
//        ).create();
//    }
//
//
//    public boolean verifyCode(@Valid CodeVerificationReq codeVerificationReq) {
//        VerificationCheck verificationCheck = VerificationCheck.creator(smsServiceSID)
//                .setTo(codeVerificationReq.phoneNumber())
//                .setCode(codeVerificationReq.code())
//                .create();
//
//        return "approved".equals(verificationCheck.getStatus());
//    }

}
