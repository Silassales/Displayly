package cis3750.group5.displayly.authentication.user;

import cis3750.group5.displayly.authentication.database.PostgreSQLService;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
@Repository
public class ApplicationUserSQLImpl implements ApplicationUserRepository {
    /**
     * Finds a user from the database by email
     *
     * @param email
     * @return An application user object represented by the email or null if the user was not found
     */
    @Override
    public ApplicationUser findByEmail(String email) {
        String sql = "SELECT * FROM \"Users\" WHERE email = ? LIMIT 1";
        Connection connection = PostgreSQLService.INSTANCE.getConnection();

        try {
            ApplicationUser user = new ApplicationUser();
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, email);
            ResultSet set = pst.executeQuery();
            while (set.next()) {
                user.setEmail(set.getString("email").trim());
                user.setPassword(set.getString("hash").trim());
                String[] authsString = (String[]) set.getArray("authorities").getArray();
                ArrayList<UserAuthority> auths = new ArrayList<>();
                for (String a : authsString) {
                    auths.add(new UserAuthority(a));
                }
                user.setAuthorities(auths);
            }
            pst.close();
            set.close();
            if (user.getEmail() != null)
                return user;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Saves the user into the database
     *
     * @param user
     */
    @Override
    public void saveUser(ApplicationUser user) {
        String sql = "INSERT INTO \"Users\"(email, hash, authorities) VALUES(?,?,?)";
        Connection connection = PostgreSQLService.INSTANCE.getConnection();
        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, user.getEmail());
            pst.setString(2, user.getPassword());
            pst.setArray(3, connection.createArrayOf("text", user.getAuthoritiesString()));
            pst.executeUpdate();
            pst.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
