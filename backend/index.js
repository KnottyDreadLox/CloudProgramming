import Express from "express";
import cors from "cors";

const app = Express();
const PORT = 3001;

app.get("/hello", (req, res) => {
    const username = req.qeury.username;
    const password = req.qeury.password;

    if(username == "joe" && password == "123"){
        res.send("Hello Joe !");
    }
    else{
        res.send("Invalid Credentials");
    }
});

app.use(cors());
app.listen(PORT, () =>
console.log("Server listening: " + PORT));
