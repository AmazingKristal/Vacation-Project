class AppConfig {
    public readonly vacationsUrl = "http://localhost:4000/api/vacations/";
    public readonly addVacationsUrl = "http://localhost:4000/api/add-vacations/";
    public readonly updateVacationsUrl = "http://localhost:4000/api/update-vacations/";
    public readonly registerUrl = 'http://localhost:4000/api/register/';
    public readonly loginUrl = 'http://localhost:4000/api/login/';
    public readonly followersUrl = 'http://localhost:4000/api/followers/';
    public readonly followersByVacUrl = 'http://localhost:4000/api/followers-by-vacation/';
}

const appConfig = new AppConfig();

export default appConfig;
