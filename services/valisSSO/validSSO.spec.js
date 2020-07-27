const {
  getHeadersBodyService,
  comparePasswordsService
} = require("./validSSO.services");
const expect = global.expect;

describe("getHeadersBodyService", () => {
  test("Return a JSON object with headers", done => {
    const headers = {
      authorization: "9c8f66514d61fcce8032924e2182e03fe7ca7e3c",
      cui: "1111111111107",
      rol: "LxPXJZUP9m53",
      action: "SFZvrfRLeMkhrizA",
      system: "morpheus",
      env: "DEV"
    };
    const result = getHeadersBodyService(headers);
    expect(result.Authorization).not.toBeUndefined();
    expect(result.cui).not.toBeUndefined();
    expect(result.rol).not.toBeUndefined();
    expect(result.action).not.toBeUndefined();
    expect(result.system).not.toBeUndefined();
    expect(result.env).not.toBeUndefined();
    done();
  });
});
describe("comparePasswordsService", () => {
  test("Return if two passwords are the same", done => {
    const password = "123456789";
    const confirmPassword = "123456789";
    const result = comparePasswordsService(password, confirmPassword);
    expect(result).toEqual(true);
    done();
  });
});