package cis3750.group5.displayly.authentication.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
public enum PostgreSQLService {

    INSTANCE;

    private Connection connection;

    /**
     * Constructor for MongoDriver
     *
     * @param address      The address or url of the database server
     * @param port         The port of the database server
     * @param databaseName The name of the database
     */
    public void configure(String address, int port, String databaseName, String username, String password) {
        try {
            connection = DriverManager.getConnection("jdbc:postgresql://" + address + ":" + port + "/" + databaseName, username, password);
        } catch (SQLException e) {
            System.out.println("Connection Failed! Check output console");
            e.printStackTrace();
        }
    }

    public Connection getConnection() {
        return connection;
    }

}
