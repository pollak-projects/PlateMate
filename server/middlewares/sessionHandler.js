const { response } = require("express");
const connect = require("../config/db");
const User = require("../models/user");

const checkSessionMiddleware = async (req, res, next) => {
    if (
        req.path === "/login" ||
        req.path === "/logout" ||
        req.path === "/redirect"
    ) {
        return next();
    }
    
    const sessionValidty = await checkSession(req, res)

    try {
        if (req.cookies['connect.sid'].split(':')[1].split('.')[0] && sessionValidty.response) {
            req.session = await findSession(req.cookies['connect.sid'].split(':')[1].split('.')[0]).response;
            return next();
        } else {
            try {
                await deleteSession(req.cookies['connect.sid'].split(':')[1].split('.')[0])
            
                req.session.destroy((err) => {
                  if (err) {
                    res.status(400).send({ message : "Hiba kijelentkeztetéskor: ", error : err});
                  }
                  res.status(200).send({ message: "Engedélytelen munkamenet, kijelentkeztetve" });
                });
              }
              catch(error) {
                res.status(500).send({ message : "Hiba kijelentkeztetéskor", error : error })
              };
        }
    }
    catch(error) {
        res.status(500).send({ message : "Hiba hitelesítéskor", error : error })
    }
};

const checkSession = async (req, res) => {
    try {
        const dbSession = await findSession(req.cookies['connect.sid'].split(':')[1].split('.')[0]);
        const dbSessionData = dbSession.response;
        
        if (dbSessionData.length === 0) {
            return { message : "Nem található ilyen munkamenet.", response :false }; 
        }

        if (
            dbSessionData[0].expires < Date.now() ||
            dbSessionData[0].ip !== req.ip
        ) {
            return { message: "A munkamenet lejárt.", response : false };
        }
        return { message : "A munkamenet érvényes.", response : true };
    } catch (err) {
        return { message : "Hiba a munkamenet ellenőrzésekor.", error : err}; 
    }
};

const findSession = async (id) => {
    return new Promise((resolve, reject) => {
        const session = connect.query(
            "SELECT * FROM `sessions` WHERE id = ?", [id], (err, result) => {
                if (err) {
                    return reject({ message : "Hiba a munkamenet lekérdezésekor.", error : err });
                }  resolve({ message : "A munkamenet sikeresen lekérdezve.", response : result });
            }
        );
    });
};

const deleteSession = async (id) => {
    return new Promise((resolve, reject) => {
        connect.query(
            "DELETE FROM `sessions` WHERE `id` = ?", [id], (err, result) => {
                if (err) {
                    return reject({ message : "Hiba a munkamenet törlésekor.", error : err });
                }
                resolve({ message : "A munkamenet sikeresen törölve.", response : result });
            }
        );
    });
};

const uploadSession = async (req, sid, userId, expires) => {
    return new Promise((resolve, reject) => {
        connect.query(
            "INSERT INTO `sessions` (`id`, `userId`, `ip`, `expires`) VALUES (?, ?, ?, ?);",
            [
                sid,
                userId,
                req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                expires
            ],
            (err, result) => {
                if (err) {
                    reject({ message : "Hiba a munkamenet feltöltésekor.", error : err });
                    return;
                } resolve({ message : "A munkamenet sikeresen feltöltve.", response : result });
            }
        );
    });
};

module.exports = {
    checkSessionMiddleware,
    uploadSession,
    findSession,
    checkSession, 
    deleteSession
}
