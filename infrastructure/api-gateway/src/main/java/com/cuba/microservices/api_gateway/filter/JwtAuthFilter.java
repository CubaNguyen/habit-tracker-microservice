package com.cuba.microservices.api_gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter {

    // 🔑 Secret key - phải giống với Auth Service (NestJS)
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        System.out.println("🔎 [Gateway] Incoming path: " + path);

        // 🧠 Bỏ qua check token cho route /api/auth/**
        if (path.contains("/profile/")||path.contains("/auth/") || path.contains("/signin") || path.contains("/signup") || path.contains("/login") || path.contains("/register")) {
            System.out.println("✅ [Gateway] Skipped JWT check for Auth route");
            return chain.filter(exchange);
        }

        // 📦 Lấy Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            // ✅ Verify token bằng secret của ông
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();

            // 🧩 Lấy thông tin payload
            String userId = String.valueOf(claims.get("sub"));
            String email = claims.get("email", String.class);
            Boolean profileComplete = claims.get("profile_complete", Boolean.class);
        // 🧾 LOG RA TERMINAL
            System.out.println("🚀 [Gateway] Token verified!");
            System.out.println("👉 User ID: " + userId);
            System.out.println("👉 Email: " + email);
            System.out.println("👉 Profile complete: " + profileComplete);
            // 🪄 Gắn header xuống cho các service khác
            ServerHttpRequest modifiedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Email", email)
                    .header("X-Profile-Complete", String.valueOf(profileComplete))
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (JwtException e) {
            System.out.println("❌ [Gateway] JWT error: " + e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }
}