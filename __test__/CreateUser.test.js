const app = require("../app");
const request = require("supertest");

describe("GET /", () => {
  it("returns HTML", async () => {
    await request(app).get("/").expect(200);
  });
});

describe("POST /createUser", () => {
  it("responds with json", async () => {
    await request(app).post("/createUser").expect(400);
  });

  it("Creates a user with success", async () => {
    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Preciado",
        username: "luigi199922",
        password: "password123",
      })
      .expect(200);
  });

  it("Rejects invalid firstName", async () => {
    await request(app)
      .post("/createUser")
      .send({
        firstName: "Thisisaverylonglastnameandshouldberejected",
        lastName: "Preciado2",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        lastName: "Preciado2",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "",
        lastName: "Preciado2",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);
  });

  it("Rejects invalid lastName", async () => {
    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Thisisaverylonglastnameandshouldberejected",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);
  });

  it("Rejects invalid password", async () => {
    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Preciado",
        username: "luigi1999222",
        password: "Thisisaverylonglastnameandshouldberejected",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Preciado",
        username: "luigi1999222",
        password: "d",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Preciado",
        username: "luigi1999222",
        password: "",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis",
        lastName: "Preciado",
        username: "luigi1999222",
      })
      .expect(400);
  });

  it("Cannot create duplicate users", async () => {
    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis2",
        lastName: "Preciado2",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(200);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis2",
        lastName: "Preciado2",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);

    await request(app)
      .post("/createUser")
      .send({
        firstName: "Luis2",
        lastName: "Preciado2",
        username: "luigi1999222",
        password: "password123",
      })
      .expect(400);
  });
});
