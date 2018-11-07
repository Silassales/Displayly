package cis3750.group5.displayly.authentication.user;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public class UserAuthority implements GrantedAuthority {

    private final String authority;

    public UserAuthority(String authority) {
        this.authority = authority.toUpperCase();
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    public String toString() {
        return authority;
    }

    /**
     * Checks to see if the list of authorities contains the given authority string
     *
     * @param authorities List of authorities
     * @param authority   String representation of authority
     * @return True or false if the authorities list contains the authority
     */
    public static boolean userHasAuthority(Collection<? extends GrantedAuthority> authorities, String authority) {
        for (GrantedAuthority grantedAuthority : authorities) {
            if (authority.equals(grantedAuthority.getAuthority())) {
                return true;
            }
        }

        return false;
    }
}
