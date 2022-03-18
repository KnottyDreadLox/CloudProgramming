import Express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import session from "express-session";
import { CreateUser, GetUser, HashPassword, GOOGLE_APPLICATION_CREDENTIALS } from "./db.js";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

import https from "https";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Session config
const config = {
  genid: (req) => uuid(),
  secret: "keyboard cat",
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

const app = Express();
app.use(cors());
app.use(session(config));

app.use(Express.static(path.join(__dirname, "../frontend/public")));

const PORT = 443;


const startServerEncrypted = async () => {
  const sm = new SecretManagerServiceClient({
    projectId: "programingforthecloud",
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  });
  const [pub] = await sm.accessSecretVersion({
    name: "projects/3469417017/secrets/PublicKey"
  });

  const [prvt] = await sm.accessSecretVersion({
    name: "projects/3469417017/secrets/PrivateKey"
  });

  const sslOptions = {
    key: prvt.payload.data.toString(),
    cert: pub.payload.data.toString(),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log("Secure Server Listening on port:" + PORT);
  });
};

const startServer = () => {
  app.listen(PORT, () => console.log("Server Listening on port: " + PORT));
};


let requests = 0;
const secretToken = uuid();


app.post("/login", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  requests++;
  if (email == "test@test.com" && password == "123") {
    res.send({ result: "success", email: "test@test.com", name: "David" });
  } else {
    res.send({ result: "fail" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/register.html"));
});


app.post("/register", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  const name = req.query.name;
  const surname = req.query.surname;
  requests++;
  //Step 1: Check if that email address already exists
  //Step 2: If the email is not registered in the database we create it
  //Step 3: If the account was created successfully we inform the user
  GetUser(email).then((r) => {
    //if this email address is not taken
    if (r.length === 0) {
      //Save the user to the database
      CreateUser(name, surname, email, password).then((r) => {
        res.send({ result: "success", email: email, name: name });
      });
    } else {
      res.send({ result: "fail", reason: "Account already exists" });
    }
  });
});

startServerEncrypted();
//console.log(secretToken);

