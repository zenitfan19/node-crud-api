import { config as dotenvConfig } from "dotenv";
import request from "supertest";
import { createServer, Server } from "http";
import uuid, { validate } from "uuid";
import { requestHandler } from "./requestHandler";
import { UserInput } from "./types";

dotenvConfig();

const PORT = process.env.PORT || 4000;

const server = createServer(requestHandler);

jest.mock("uuid", () => ({
  v4: jest.fn(),
  validate: jest.fn(),
}));

const mockUuid = "ed245ce0-660c-44fd-a1f3-167171388f04";

const user: UserInput = {
  username: "John",
  age: 25,
  hobbies: ["football"],
};

const updatedUser: UserInput = {
  username: "John",
  age: 27,
  hobbies: ["football", "coding"],
};

describe("GET /api/users", () => {
  let app: Server;
  let uuidV4Spy: jest.SpyInstance;
  let uuidValidateSpy: jest.SpyInstance;

  beforeAll((done) => {
    app = server.listen(PORT, done);
  });

  beforeEach(() => {
    uuidV4Spy = jest.spyOn(uuid, "v4");
    uuidValidateSpy = jest.spyOn(uuid, "validate");
  });

  afterAll((done) => {
    app.close(done);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET methods", () => {});

  it("should return an empty array initially", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });
  it("should create a new user", async () => {
    uuidV4Spy.mockReturnValue(mockUuid);

    const response = await request(app)
      .post("/api/users")
      .send(user)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: mockUuid,
      ...user,
    });
  });
  it("should return an array with newly creted user", async () => {
    uuidValidateSpy.mockReturnValue(true);
    const response = await request(app).get(`/api/users/${mockUuid}`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: mockUuid,
      ...user,
    });
  });
  it("should update a user", async () => {
    uuidValidateSpy.mockReturnValue(true);

    const response = await request(app)
      .put(`/api/users/${mockUuid}`)
      .send(updatedUser)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: mockUuid,
      ...updatedUser,
    });
  });
  it("should delete a user", async () => {
    uuidValidateSpy.mockReturnValue(true);

    const response = await request(app).delete(`/api/users/${mockUuid}`);
    expect(response.status).toBe(204);
  });
  it("should handle an invalid format of uuid", async () => {
    uuidValidateSpy.mockReturnValue(false);

    const response = await request(app).get(`/api/users/${mockUuid}123`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user id");
  });
  it("should handle a non-existing user", async () => {
    uuidValidateSpy.mockReturnValue(true);
    const nonExistingUserUuid = "0c77bfe3-1830-4d30-a218-4e6852878f3c";

    const response = await request(app).get(
      `/api/users/${nonExistingUserUuid}`
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
  it("should handle a creating user without required fields", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({})
      .set("Content-Type", "application/json");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user data");
  });
  it("should handle an invalid url", async () => {
    const response = await request(app).get("/api/phones");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Invalid endpoint");
  });
});
