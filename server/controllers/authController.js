const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { deleteSession, uploadSession, checkSession } = require("../middlewares/sessionHandler");

const register = async (req, res) => {
  const { name, email, password, permissionId} = req.body;
  
  if (!name || !email || !password || !permissionId) {
    return res.status(400).json({ message: "Minden mező megadása kötelező." });
  }

  const users = await User.findOne(req.body.email)

  if (users.data.length != 0) { res.status(409).send({"message" : "Az email cím már foglalt."}) }

  else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = new User(name, hashedPassword, email, permissionId);
  
    try {
      const savedUser = await user.save();
  
      res.status(200).send(savedUser);
    } catch (err) {
      res.status(400).send({ message : "Hiba történt a mentés során", error : err});
    }
  }
};

const login = async (req, res) => {
  const sessionCheck = await checkSession(req, res);

  const sessionId = await uuidv4();

  if(sessionCheck.response) { 
    const users = await User.findOne(req.body.email);
    const user = users.data[0]

    const jti = await uuidv4();
    const token = jwt.sign(
    {
      jti: jti,
      sub: user.email,
      iss: process.env.ISSUER,
      typ: "Bearer",
      preferred_username: user.name,
      sid: sessionId,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "3h",
    });

    const refreshToken = await generateRefreshToken(jti, user, sessionId);

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.send({ "message" : "Belépve érvényes munkamenet alapján." })
  } else {
    const users = await User.findOne(req.body.email);
    const user = users.data[0]

    if (!user) return res.status(400).send({ message : "Érvénytelen email cím." });

    const validPass = await bcrypt.compare(req.body.password, user.hashedPassword);

    if (!validPass) return res.status(400).send({ message : "Érvénytelen jelszó." });

    const jti = await uuidv4();
    const token = jwt.sign(
    {
      jti: jti,
      sub: user.email,
      iss: process.env.ISSUER,
      typ: "Bearer",
      preferred_username: user.name,
      sid: sessionId,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "3h"}
    );
    
    try{
      const refreshToken = await generateRefreshToken(jti, user, sessionId);

      const expires = formatDateToMySQL(Date.now() + 86400000);

      await uploadSession(req, sessionId, user.id, expires)

      res.cookie('connect.sid', `s:${sessionId}`, { 
        httpOnly: true, 
        maxAge: 86400000 
      });

      res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 3 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      });

      res.status(200).send({ "message" : "Belépve új munkamenettel." })
    }
    catch (error){
      res.status(500).send({ error : error })
    }
  }
};

const generateRefreshToken = async (jti, user, sid) => {
  return jwt.sign(
    {
      iss: process.env.ISSUER,
      jti: jti,
      typ: "Refresh",
      sub: user.email,
      sid: sid,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

const logout = async (req, res) => {
  try {
    const response = await deleteSession(req.cookies['connect.sid'].split(':')[1].split('.')[0])

    if(response.response.affectedRows == 0) res.status(400).send({ message : "Hiba történt a kilépéskor"});

    req.session.destroy((err) => {
      if (err) {
        if(!res.headersSent) res.status(400).send({ message : "Hiba történt a kilépéskor", error : err });
      }
      if(!res.headersSent) res.status(200).send({ message : "Sikeresen kilépve." });
    });
  }
  catch(error) {
    if(!res.headersSent) res.status(500).send({ message : "Hiba kijelentkezéskor.", error : error })
  };
}

const formatDateToMySQL = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
  logout,
  login,
  register,
  generateRefreshToken
}