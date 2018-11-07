package cis3750.group5.displayly.util;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public class ResponseUtil {
    public static void setResponse(int status, String message, HttpServletResponse response) {
        response.setStatus(status);
        try {
            response.getWriter().write(message);
            response.getWriter().flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
