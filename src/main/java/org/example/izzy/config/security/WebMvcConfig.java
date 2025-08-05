package org.example.izzy.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
//    CORS Configuration
public class WebMvcConfig implements WebMvcConfigurer {
//    CORS Configuration

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080","http://localhost:3000")    /*Your WebMvcConfig allows all origins (allowedOrigins("*")),
                                          methods, and headers. This is fine for development but dangerous in production,
                                          as it allows any website to make requests to your API.*/
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true); /* Required for cookies =>Set allowCredentials(true) since you’re using cookies,
                 but ensure allowedOrigins is not "*" when credentials are allowed.*/

    }
}
