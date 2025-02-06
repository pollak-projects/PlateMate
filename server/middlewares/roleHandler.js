const jwt = require("jsonwebtoken");
const connect = require("../config/db");
const User = require("../models/user");

const roleCheck = (allowedRoles) => {
    return async (req, res, next) => {
        
        const email = getEmailFromToken(req.cookies.token)

        const users = await User.findOne(email);
        const user = users.data[0]
        
        const section = await getSectionFromId(user.permissionId)

        if (!user || !section || !allowedRoles.includes(section.data[0].section)) return res.status(403).send({ message: 'Hozzáférés megtagadva' });

        next(); 
    };
};

const getEmailFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET); 
        return decoded.sub;
    } catch (err) {
        return null;
    }
};

const getSectionFromId = async (id) => {
    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("SELECT `section` FROM `permissionsettings` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!response.length) return null;

        return { message: "Role sikeresen lekérve.", data: response };
    } catch (error) {
        return null;
    }
};

module.exports = {
    roleCheck,
    getEmailFromToken,
    getSectionFromId
}