package com.example.e_channeling_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LogInRequestDto {

    private String email;
    private String password;
}
