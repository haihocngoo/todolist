package com.example.demo.service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.dto.response.UserResponse;



public interface UserService {
    UserResponse registerUser(UserRequest request);
    LoginResponse loginUser(LoginRequest request);
}
