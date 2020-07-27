Feature: Oauth
    Oauth

    Scenario: get access token by username and password
        Given set my username "1111111111107" and password "Soporte123*"
        When send my credentials to Seguridad API
        Then I get my user data

    Scenario: get the error message by incorrect username and password
        Given set my username "1111111111107" and password "Soporte123"
        When send my credentials to Seguridad API
        Then I don't get my user data