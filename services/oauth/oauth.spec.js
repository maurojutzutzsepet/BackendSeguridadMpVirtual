const {
  getOptionGetOauthService,
  getUserSystemService
} = require("./oauth.services");
const expect = global.expect;

describe("getHeadersBodyService", () => {
  test("Return a JSON object with headers, and oauth attributes", done => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    const result = getOptionGetOauthService(headers);
    expect(result.auth["username"]).not.toBeUndefined();
    expect(result.auth["password"]).not.toBeUndefined();
    done();
  });
});
describe("getUserSystemService", () => {
  test("Return a User System", done => {
    const userSystem = "SFZv";
    const systems = [{
      "rol": [{
        "_id": "5e593508ed4702513a71790f",
        "tagRol": "LxPXJZUP9m53"
      }],
      "_id": "5e599111d102f35ff639cee0",
      "tag": "SQsa"
    }, {
      "rol": [{
        "_id": "5e593508ed4702513a71790f",
        "tagRol": "LxPXJZUP9m53"
      }],
      "_id": "5e599111d102f35ff639cee0",
      "tag": "SFZv"
    }];
    const result = getUserSystemService(systems, userSystem);
    expect(result).not.toEqual(null);
    done();
  });
});