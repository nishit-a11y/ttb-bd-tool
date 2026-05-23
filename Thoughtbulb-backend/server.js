require("dotenv").config();
const express = require("express");
const app = express();
const gen = require("./generator");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const admin = require("firebase-admin");
const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(creds),
});

const db = admin.firestore();

app.get("/api/generate/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const proposals = db.collection("proposals").doc(id);
        const objs = db.collection("objectives").doc("L01kupuf27xPC4ZdDsq4");
        const games = db.collection("games");

        console.log(games)
        const response = await proposals.get();
        const obj_response = await objs.get();
        const game_response = await games.get();
        const game_data = game_response.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));

        // res.send(response.data())

        if (await gen.generate(response.data(), obj_response.data(), game_data)) {
            fs.readFile("/tmp/Report.pdf", (err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.contentType("application/pdf");
                res.send(data);
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/api/preview/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const proposals = db.collection("proposals").doc(id);
        const objs = db.collection("objectives").doc("L01kupuf27xPC4ZdDsq4");
        const games = db.collection("games");

        const response = await proposals.get();
        const obj_response = await objs.get();
        const game_response = await games.get();
        const game_data = game_response.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));

        // res.send(response.data())

        let html = await gen.generate(response.data(), obj_response.data(), game_data, true);
        res.send(html);
    } catch (error) {
        res.send(500).send(error);
    }
});

app.post("/api/update_password", (req, res) => {
    let email = req.body.email;
    let newPassword = req.body.password;

    if (!email) {
        return res.status(400).json({ msg: "email is missing" });
    }

    if (!newPassword) {
        return res.status(400).json({ msg: "password is missing" });
    }

    admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            const uid = userRecord.uid;
            return admin.auth().updateUser(uid, {
                password: newPassword,
            });
        })
        .then(() => {
            console.log("Password updated successfully!");
            return res.status(201).json({ msg: "Password updated successfully!" });
        })
        .catch((error) => {
            console.error("Error updating password:", error);
            return res.status(400).json({ msg: "Password update failed" });
        });
});

app.post("/api/delete_user", async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ msg: "email is missing" });
    }

    admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            console.log(userRecord);
            const uid = userRecord.uid;
            return admin.auth().deleteUser(uid);
        })
        .then(() => {
            db.collection("users")
                .where("email", "==", email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });

            console.log("User deleted successfully!");
            return res.status(201).json({ msg: "User deleted successfully!" });
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
            return res.status(400).json({ msg: "User deletion failed" });
        });
});

const { rateLimit } = require("express-rate-limit");

const aiRateLimit = rateLimit({
    windowMs: 60 * 1000, //60 seconds
    max: 6,
    keyGenerator: (req) => req.user.uid,
    message: { error: "Too many requests, try again later" },
});

const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        req.user = await admin.auth().verifyIdToken(token);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

app.post("/api/ai/chat", verifyFirebaseToken, aiRateLimit, async (req, res) => {
    try {
        const { model, messages } = req.body;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({ model: model || "gpt-3.5-turbo", messages }),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});
