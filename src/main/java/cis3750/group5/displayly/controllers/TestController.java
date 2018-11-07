package cis3750.group5.displayly.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
@RestController // Must be annotated with @RestController to tell spring to instantiate this class on startup
public class TestController {

    @GetMapping("/test") // Annotating this method with GetMapping tells Spring to open a GET endpoint with this string
    @PreAuthorize("hasAuthority('USER')") // User must be authenticated to reach this end point
    public String test(Authentication auth) {
        System.out.println(auth.getPrincipal()); // Once authenticated the user's information is stored in this auth object which can be used to query the database or do whatever
        return "Hello World";
    }
}
