package com.rest.auction.users.entity;

import com.rest.auction.common.models.AuditModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.util.Collection;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = "email")})
public class User extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;

    private String address;

    @NotEmpty
    private String mobileNumber;

    private String selfieUrl;

    @NotEmpty
    @Email
    private String email;

    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<Role> roles;

    public void setPassword(String password) {
        this.password = password;
    }
}
