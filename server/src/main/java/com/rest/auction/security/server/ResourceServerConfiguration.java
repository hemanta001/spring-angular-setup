package com.rest.auction.security.server;

import com.rest.auction.errors.CustomAccessDeniedHandler;
import com.rest.auction.errors.CustomAuthenticationEntryPoint;
import com.rest.auction.security.constants.RoleConstants;
import com.rest.auction.users.repository.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    public ResourceServerConfiguration(CustomAuthenticationEntryPoint customAuthenticationEntryPoint, UserRepository userRepository) {
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId("api");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .antMatcher("/api/**")
                .authorizeRequests()
                .antMatchers("/api/signup**").permitAll()
                .antMatchers("/swagger-ui**").permitAll()
                .antMatchers("/api/signup/**").permitAll()
                .antMatchers("/api/users/isAdminRegistered").permitAll()
                .antMatchers("/api/users/getRoles").permitAll()
                .antMatchers("/api/users/getRoleByName").permitAll()
                .antMatchers("/api/users**").hasAnyAuthority(RoleConstants.ROLE_ADMIN)
                .antMatchers("/api/**").authenticated()
                .antMatchers(HttpMethod.DELETE,"/api/oauth/token**","/api/profile**").
                hasAnyAuthority(RoleConstants.ROLE_ADMIN,
                        RoleConstants.ROLE_BIDDER
                        )
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(customAuthenticationEntryPoint).accessDeniedHandler(new CustomAccessDeniedHandler());
    }

}
