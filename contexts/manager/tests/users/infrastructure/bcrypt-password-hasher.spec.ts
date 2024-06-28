import { BcryptPasswordHasher } from "../../../modules/users";

describe("BcryptPasswordHasher", () => {
  it("should has a string", async () => {
    const stringToHash = "password";

    const hasher = new BcryptPasswordHasher();
    const hash = await hasher.hash(stringToHash);

    expect(typeof hash === "string").toBe(true);
    expect(hash !== stringToHash).toBe(true);
  });
});
