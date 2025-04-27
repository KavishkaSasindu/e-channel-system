package com.example.e_channeling_backend.jwt;

import com.example.e_channeling_backend.service.auth.MyUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
public class JwtFilter extends OncePerRequestFilter {

    private final MyUserDetails myUserDetails;
    private JwtService jwtService;

    @Autowired
    public JwtFilter(JwtService jwtService, MyUserDetails myUserDetails) {
        this.jwtService = jwtService;
        this.myUserDetails = myUserDetails;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String token = tokenFromRequest(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

//        get username from the token(subject)
        String username = jwtService.getSubject(token);
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = myUserDetails.loadUserByUsername(username);
            if(jwtService.validateToken(token, user)) {
                UsernamePasswordAuthenticationToken new_token = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                new_token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(new_token);
            }
        }
        filterChain.doFilter(request, response);
    }

//    get token from the header
    public String tokenFromRequest(@NonNull HttpServletRequest request) {
        String token  = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            return token;
        }
        return null;
    }
}
