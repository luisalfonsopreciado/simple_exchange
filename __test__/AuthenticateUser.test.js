const app = require("../app");
const request = require("supertest");

describe("POST /authenticate", () => {
  it("Authenticate user", async () => {
    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luisone",
        lastName: "Preciadon",
        username: "luigi199922123",
        password: "password123123",
      })
      .expect(200);

    await request(app)
      .post("/authenticate")
      .send({ username: "luigi199922123", password: "password123123" })
      .expect(200);
  });

  it("Rejects invalid input", async () => {
    await request(app).post("/authenticate").send({}).expect(400);

    await request(app).post("/authenticate").send(null).expect(400);

    await request(app).post("/authenticate").send("somestrs").expect(400);
  });

  it("Reject nonexistent user", async () => {
    await request(app)
      .post("/authenticate")
      .send({ username: "luigi199922", password: "password123" })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Preciado",
        username: "luigi199922",
        password: "password123",
      })
      .expect(200);

    const res = await request(app)
      .post("/authenticate")
      .send({ username: "luigi199922", password: "password123" })
      .expect(200);

    expect(res).toBeTruthy();
    expect(res.body).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(typeof res.body.token === "string").toBeTruthy();
    expect(res.body.token.length > 1).toBeTruthy();

    await request(app)
      .post("/authenticate")
      .send({ username: "luigi199922", password: "password1213" })
      .expect(400);

    await request(app)
      .post("/authenticate")
      .send({ username: "luigi1999222", password: "password1213" })
      .expect(400);
  });
});
