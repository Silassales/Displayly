package cis3750.group5.displayly.authentication;

import cis3750.group5.displayly.authentication.user.ApplicationUser;
import cis3750.group5.displayly.authentication.user.ApplicationUserRepository;
import cis3750.group5.displayly.util.ResponseUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final String SECRET;

    private final AuthenticationManager authenticationManager;
    private final ApplicationUserRepository applicationUserRepository;

    private ApplicationUser credentials;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, ApplicationUserRepository applicationUserRepository, String secret) {
        this.authenticationManager = authenticationManager;
        this.applicationUserRepository = applicationUserRepository;
        this.SECRET = secret;
    }

    /**
     * Receives the login request and attempts to map the user to an ApplicationUser object
     *
     * @param req Request from the client
     * @param res Response to be sent to the client
     * @return An authentication
     * @throws AuthenticationException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) {
        try {
            ApplicationUser credentials = new ObjectMapper().readValue(req.getInputStream(), ApplicationUser.class);
            this.credentials = credentials;
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(credentials.getEmail(), credentials.getPassword(), new ArrayList<>()));
        } catch (IOException e) {
            ResponseUtil.setResponse(401, "Invalid post props received", res);
        }
        return null;
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        SecurityContextHolder.clearContext();
        if (credentials.getEmail() == null || credentials.getEmail().equals("")) {
            ResponseUtil.setResponse(401, "Empty Email", response);
            return;
        }
        if (applicationUserRepository.findByEmail(credentials.getEmail()) == null) {
            ResponseUtil.setResponse(401, credentials.getEmail() + " is not a registered email", response);
            return;
        }
        ResponseUtil.setResponse(401, "Invalid username password combination", response);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) throws IOException {
        String token = Jwts.builder()
                .setHeaderParam("Authorities", auth.getAuthorities())
                .setSubject(((User) auth.getPrincipal()).getUsername())
                .signWith(SignatureAlgorithm.HS256, SECRET.getBytes()) // Sign the message
                .compact();
        res.setContentType("application/json");
        PrintWriter out = res.getWriter();
        out.print("{ \"api-key\": \"" + token + "\" }");
        out.flush();
    }
}
