const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

const checkTokenMiddleware = async (req, res, next) => {
    if (
        req.path === "/login" ||
        req.path === "/logout" ||
        req.path === "/redirect"
    ) {
        return next();
    }

    const token = req.cookies.token;

    if (!token) return res.status(401).send({ message : "Jogosultság megtagadva, nincs token." });
    try {
        if(await verifyToken(req, res) &&  await refreshToken(req, res)) next()
    } catch (err) {
        if(!res.headersSent)res.status(400).send({ message : "Érvénytelen token." });
    }
};

const verifyToken = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).send({ message : "Jogosultság megtagadva, nincs token." });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (req.cookies['connect.sid'].split(':')[1].split('.')[0] !== verified.sid) return res.status(400).send({message : "Érvénytelen token" });
        return true
    } catch (err) {
        res.status(400).send({ message : "Érvénytelen token" });
    }
};

const refreshToken = async (req, res) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    if (!token) return res.status(401).send({ message : "Jogosultság megtagadva, nincs token." });
    if (!refreshToken) return res.status(400).send({ message : "Jogosultság megtagadva, nincs refresh token." });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const verifiedRefresh = jwt.verify(refreshToken,process.env.TOKEN_SECRET);

        if (verifiedRefresh.exp < Math.floor(Date.now() / 1000))
            return res.status(400).send({ message : "Lejárt refresh token." });
        if (verifiedRefresh.typ !== "Refresh")
            return res.status(400).send({ message : "Érvénytelen refresh token." });
        if (verified.iss !== verifiedRefresh.iss)
            return res.status(400).send({ message : "Érvénytelen issuer." });
        if (verified.sub !== verifiedRefresh.sub)
            return res.status(400).send({ message : "Érvénytelen subject." });
        if (
            verified.sid !== verifiedRefresh.sid ||
            verifiedRefresh.sid !== req.cookies['connect.sid'].split(':')[1].split('.')[0] ||
            verified.sid !== req.cookies['connect.sid'].split(':')[1].split('.')[0]
        ) return res.status(400).send({ message : "Érvénytelen session id." });

        const jti = await uuidv4();
        const users = await User.findOne(verified.sub);
        const user = users.data[0]
        const newToken = jwt.sign(
            {
                jti: jti,
                sub: user.email,
                iss: process.env.ISSUER,
                sid: req.cookies['connect.sid'].split(':')[1].split('.')[0],
                typ: "Bearer",
                preferred_username: user.email,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "3h",
            }
        );

        res.cookie("token", newToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3 * 60 * 60 * 1000,
          });
    
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, 
          });

          return true
    } catch (err) {
        res.status(400).send({ message : "Érvénytelen refresh token.", error : err });
    }
};

module.exports = {
    checkTokenMiddleware,
    verifyToken,
    refreshToken
} 
