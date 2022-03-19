package com.rest.auction;

import com.rest.auction.users.repository.RoleRepository;
import com.rest.auction.users.entity.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AuctionApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuctionApplication.class, args);
    }

    @Bean
    public CommandLineRunner saveRoles(RoleRepository repo) {
        return (args) -> {
            if (repo.findByName("ADMIN") == null)
                repo.save(new Role("ADMIN"));
            if (repo.findByName("BIDDER") == null)
                repo.save(new Role("BIDDER"));
        };
    }

}
