package cis3750.group5.displayly.authentication;

import cis3750.group5.displayly.authentication.user.UserAuthority;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private final String HEADER_STRING;
    private final String SECRET;

    public JWTAuthorizationFilter(AuthenticationManager authenticationManager, String headerString, String secret) {
        super(authenticationManager);
        this.HEADER_STRING = headerString;
        this.SECRET = secret;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String token = req.getHeader(HEADER_STRING); // Try to get from header
        if (token == null) {
            token = req.getParameter(HEADER_STRING); // Try to get from Query Parameter
        }

        if (token == null) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(token);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String token) {
        if (token != null) {
            Jws<Claims> c = Jwts.parser()
                    .setSigningKey(SECRET.getBytes())
                    .parseClaimsJws(token);
            String username = c.getBody().getSubject();
            Collection<LinkedHashMap<String, String>> authorities;
            try {
                authorities = (Collection<LinkedHashMap<String, String>>) c.getHeader().get("Authorities");
            } catch (ClassCastException e) {
                return null; // Wrong type was sent
            }
            ArrayList<UserAuthority> verifiedAuthorities = new ArrayList<>();
            for (LinkedHashMap<String, String> g : authorities) {
                verifiedAuthorities.add(new UserAuthority(g.get("authority")));
            }
            if (username != null) {
                return new UsernamePasswordAuthenticationToken(username, null, verifiedAuthorities);
            }
        }
        return null;
    }
}
