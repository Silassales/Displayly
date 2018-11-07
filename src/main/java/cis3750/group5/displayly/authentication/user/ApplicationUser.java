package cis3750.group5.displayly.authentication.user;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
@Entity
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String password;
    private String email;
    private ArrayList<UserAuthority> authorities;

    public Collection<UserAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(ArrayList<UserAuthority> authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthoritiesString() {
        if (this.authorities == null)
            return null;
        String[] auths = new String[authorities.size()];
        for (int i = 0; i < authorities.size(); i++) {
            auths[i] = authorities.get(i).toString();
        }
        return auths;
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
