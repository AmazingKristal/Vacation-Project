class AppConfig {

    // Server Port:
    public readonly port = 4000;

    // Database Host (on which computer the database exists):
    public readonly mySqlHost = "localhost";

    // Database User
    public readonly mySqlUser = "root";

    // Database Password: 
    public readonly mySqlPassword = "";

    // Database Name: 
    public readonly mySqlDatabase = "vacation"; // Fill in database name

    public readonly domainName = "http://localhost:" + this.port;
}

const appConfig = new AppConfig();

export default appConfig;
