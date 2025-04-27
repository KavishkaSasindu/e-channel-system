package com.example.e_channeling_backend.jwt;

import com.example.e_channeling_backend.model.UserProfile;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${secret_key}")
    private String secret_key;

//    generate a key
    public SecretKey generatSecretKey() {
        byte[] key = Decoders.BASE64.decode(secret_key);
        return Keys.hmacShaKeyFor(key);
    }

//    generate token
    public String generateToken(Map<String,Object> claims, UserProfile userProfile) {
        return Jwts.builder()
                .subject(userProfile.getProfileEmail())
                .claims(claims)
                .signWith(generatSecretKey(),Jwts.SIG.HS256)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*60*24))
                .compact();
    }

    //get subject from token
    public String getSubject(String token) {
        return Jwts.parser()
                .verifyWith(generatSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

//    get all claims
    public Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(generatSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

//    get one claim
    public <T> T getOneClaim(String token, Function<Claims,T> claimsResolver) {
        Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //    check is valid
    public boolean validateToken(String token, UserDetails userDetails) {
        return getSubject(token).equals(userDetails.getUsername());
    }

}
