const request = require("supertest");
const app = require("../index");
const { User, Organisation } = require("../src/models/model");

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  }, 15000);

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it("should register user successfully with default organisation", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ilonze",
      lastName: "Chibuikem",
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
      phone: "1234567890",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.firstName).toBe("Ilonze");
    expect(res.body.data.user.lastName).toBe("Chibuikem");
    expect(res.body.data.accessToken).toBeDefined();
  }, 10000);

  it("should log the user in successfully", async () => {
    await request(app).post("/api/auth/register").send({
      firstName: "Ilonze",
      lastName: "Chibuikem",
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
      phone: "1234567890",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("chibuikemichaelilonze@gmail.com");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ilonze",
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
    });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].message).toContain("Last name is required");
  });

  it("should fail if there’s duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      firstName: "Ilonze",
      lastName: "Chibuikem",
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
      phone: "09036000775",
    });

    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ilonze",
      lastName: "Chioma",
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
      phone: "09036117775",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("User already exists");
  });
});

describe("Organisation Access", () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Organisation.destroy({ where: {} });
  });

  it("should not allow users to see data from organisations they do not have access to", async () => {
    const user1 = await User.create({
      firstName: "Ilonze",
      lastName: "Chibuikem",
      email: "chibuikemichaelilonze@gmail.com",
      password: "password234",
      phone: "1234567890",
    });

    const user2 = await User.create({
      firstName: "Ilonze",
      lastName: "Chibuikem",
      email: "justilonze@gmail.com",
      password: "password234",
      phone: "1234567890",
    });

    const organisation = await Organisation.create({
      name: "Ilonze's Organisation",
    });

    await user1.addOrganisation(organisation);

    const token1 = user1.createJWT();
    const token2 = user2.createJWT();

    const response = await request(app)
      .get(`/api/organisations/${organisation.orgId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access denied");
  }, 10000);
});
