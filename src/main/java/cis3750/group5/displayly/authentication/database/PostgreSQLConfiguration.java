package cis3750.group5.displayly.authentication.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

/**
 * Created by Jack Zavarella on 11/7/2018. :)
 */
@Configuration
public class PostgreSQLConfiguration {

    @Value("${postgres.address}")
    private String DATABASE_SERVER_ADDRESS;
    @Value("${postgres.port}")
    private int DATABASE_SERVER_PORT;
    @Value("${postgres.db}")
    private String DATABASE_NAME;
    @Value("${postgres.user}")
    private String DATABASE_USER;
    @Value("${postgres.password}")
    private String DATABASE_PASS;

    /**
     * Configures the instance of the MongoDriver that will be used by the service layer
     */
    @PostConstruct
    public void configure() {
        PostgreSQLService.INSTANCE.configure(DATABASE_SERVER_ADDRESS, DATABASE_SERVER_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASS);
    }
}
