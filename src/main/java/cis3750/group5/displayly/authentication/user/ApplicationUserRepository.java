package cis3750.group5.displayly.authentication.user;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public interface ApplicationUserRepository {
    /**
     * Finds a user from the database by email
     *
     * @param email
     * @return An application user object represented by the email or null if the user was not found
     */
    ApplicationUser findByEmail(String email);

    /**
     * Saves the user into the database
     *
     * @param user
     */
    void saveUser(ApplicationUser user);
}
