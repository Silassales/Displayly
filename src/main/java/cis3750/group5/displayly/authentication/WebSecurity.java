package cis3750.group5.displayly.authentication;

import cis3750.group5.displayly.authentication.user.ApplicationUserRepository;
import cis3750.group5.displayly.authentication.user.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurity extends WebSecurityConfigurerAdapter {

    // Get the sign up url from the application.properties
    @Value("${security.sign-up-url}")
    private String SIGN_UP_URL;

    // Get the authorization header string from the application.properties
    @Value("${security.header-string}")
    private String HEADER_STRING;

    // TODO: Make this secure
    // Get the secret for encryption from the application.properties
    @Value("${security.secret}")
    private String SECRET;

    // Get the expiry time for the application.properties
    @Value("${security.expiration-time}")
    private long EXPIRATION_TIME;

    private final UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ApplicationUserRepository applicationUserRepository;

    public WebSecurity(UserDetailsServiceImpl userDetailsService, BCryptPasswordEncoder bCryptPasswordEncoder, ApplicationUserRepository applicationUserRepository) {
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.applicationUserRepository = applicationUserRepository;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                .antMatchers(HttpMethod.POST, SIGN_UP_URL).permitAll()
                .and()
                .addFilter(new JWTAuthenticationFilter(authenticationManager(), applicationUserRepository, SECRET))
                .addFilter(new JWTAuthorizationFilter(authenticationManager(), HEADER_STRING, SECRET))
                .logout().logoutUrl("/logout").invalidateHttpSession(true).logoutSuccessUrl("/")
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
