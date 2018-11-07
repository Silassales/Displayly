package cis3750.group5.displayly.util;

import org.apache.commons.validator.routines.EmailValidator;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public class RegexUtil {
    public static boolean validateEmailRegex(String email) {
        return EmailValidator.getInstance().isValid(email);
    }

    public static boolean validateUsernameRegex(String username) {
        return validateRegex(username, "^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$");
    }

    public static boolean validatePasswordRegex(String password) {
        return validateRegex(password, "^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$");
    }

    public static boolean validateRegex(String line, String pattern) {
        Matcher m = Pattern.compile(pattern).matcher(line);
        return m.matches();
    }

    public static boolean validateRegex(String line, String pattern, int sensitivity) {
        Matcher m = Pattern.compile(pattern, sensitivity).matcher(line);
        return m.matches();
    }
}
