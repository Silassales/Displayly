package cis3750.group5.displayly.authentication.user;


import cis3750.group5.displayly.util.RegexUtil;
import cis3750.group5.displayly.util.ResponseUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
@RestController
@RequestMapping("/users")
public class UserController {
    private static final int EMAIL_ERR = 580;
    private static final int PASSWORD_ERR = 582;

    private final ApplicationUserRepository applicationUserRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(ApplicationUserRepository applicationUserRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.applicationUserRepository = applicationUserRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    /**
     * Request end point for registering a user. Handles all necessary validation
     *
     * @param user The user provided by spring boot
     * @param res  The response we send back to the client
     */
    @PostMapping("/sign-up")
    public void signUp(@RequestBody ApplicationUser user, HttpServletResponse res) {
        if (user.getPassword() == null) { // Check to see if the password is set
            ResponseUtil.setResponse(PASSWORD_ERR, "Missing password field", res);
            return;
        }
        if (user.getEmail() == null) { // Check to see if the email field is set
            ResponseUtil.setResponse(EMAIL_ERR, "Missing email field", res);
            return;
        }
        if (!RegexUtil.validateEmailRegex(user.getEmail())) { // Check to see if the email is a valid email regex
            ResponseUtil.setResponse(EMAIL_ERR, "Not a valid email", res);
            return;
        }

        String pass = user.getPassword();
        if (pass.length() < 4) { // Checks to see if the password is strong enough
            ResponseUtil.setResponse(PASSWORD_ERR, "Password is not strong enough, must be at least 4 characters", res);
            return;
        }
        if (applicationUserRepository.findByEmail(user.getEmail()) != null) { // Checks to see if that email is already registered
            ResponseUtil.setResponse(EMAIL_ERR, user.getEmail() + " is already a registered email", res);
            return;
        }
        user.setPassword(bCryptPasswordEncoder.encode(pass)); // Encode the password and set it
        ArrayList<UserAuthority> auths = new ArrayList<>();
        auths.add(new UserAuthority("USER"));
        user.setAuthorities(auths);
        applicationUserRepository.saveUser(user); // Save the user into the database
        // TODO: Email validation
    }
}
