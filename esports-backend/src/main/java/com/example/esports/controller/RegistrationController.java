package com.example.esports.controller;

import com.example.esports.dto.RegistrationRequest;
import com.example.esports.entity.Registration;
import com.example.esports.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public Registration register(@Valid @RequestBody RegistrationRequest request) {
        return registrationService.register(request);
    }
}
