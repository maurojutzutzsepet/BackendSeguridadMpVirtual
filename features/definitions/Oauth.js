/* eslint-disable no-undef */
const {
  Given,
  When,
  Then
} = require("cucumber");

const {
  oauthEndpoint
} = require("../support//pages/Oauth");

const httpController = require("../support/controllers/httpControllerHolder");

const assert = require("assert");

let result = {},
  payload = {};

/**
 * GENERAL
 */
Given(
  "set my username {string} and password {string}",
  async (username, password) => {
    payload = {
      username,
      password
    };
  }
);

When("send my credentials to Seguridad API", async () => {
  const url = `${oauthEndpoint.url()}/user/oauth/login`;
  console.log(url, payload);
  result = await httpController.post(url, payload);
  console.log("------>>>>", result, "<<<<--------");
});

/**
 * Scenario: get access token by username and password
 */

Then("I get my user data", () => {
  assert.strictEqual(result.valid, true);
});

/**
 * Scenario:get the error message by incorrect username and password
 */
Then("I don't get my user data", () => {
  assert.strictEqual(result.valid, false);
});