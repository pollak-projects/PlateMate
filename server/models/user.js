const connect = require("../config/db");

class User {
    constructor(name, password, email, permissionId) {
        this.name = name;
        this.password = password;
        this.email = email
        this.permissionId = permissionId
    }

    async save() {
        try {
            const response = await new Promise((resolve, reject) => {
                connect.query("INSERT INTO `user` ( `name`, `hashedPassword`, `email`, `permissionId`) VALUES (?, ?, ?, ?);", [this.name, this.password, this.email, this.permissionId], (err, result, fields) => {
                    if (err) reject(err); 
                    else resolve(result);
                });
            })

            return { message: "Felhasználó sikeresen létrehozva.", data: response };
        } catch (error) {
            return { message: "Hiba történt a foglalás létrehozása során.", error };
        }
    }

    static async findOne(email) {
        try {    
            const user = await new Promise((resolve, reject) => {
                connect.query("SELECT * FROM `user` WHERE `email` = ?", [email], (err, result) => {
                    if (err) reject(err); 
                    resolve(result);  
                });
            });

            if (!user.length) {
                return { message: "A megadott felhasználó nem található.", data: user };
            }
    
            return { message: "Felhasználó sikeresen lekérve.", data: user };
        } catch (error) {
            return { message: "Hiba történt a felhasználó lekérése során.", error };
        }
    }

    static async delete(email) {
        try {
            const response = await new Promise((resolve, reject) => {
                connect.query("DELETE FROM `user` WHERE `user`.`email` = ?", [email], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
    
            if (response.affectedRows === 0) {
                return { message: "A megadott ID-hoz tartozó felhasználó nem található." };
            }
    
            return { message: "Felhasználó sikeresen törölve.", data: response };
        } catch (error) {
            return { message: "Hiba történt a felhasználó törlése során.", error };
        }
    }

    static async update(name, password, email, permissionId) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        try {
            const response = await new Promise((resolve, reject) => {
                connect.query("UPDATE `user` SET `name` = ?, `email` = ?, `hashedPassword` = ?, `permissionLevel` = ? WHERE `email` = ?", [name, email, hashedPassword, permissionId, email], (err, result, fields) => {
                    if (err) reject(err); 
                    else resolve(result);
                });
            })

            if (response.affectedRows === 0) {
                return { message: "A megadott ID-hoz tartozó felhasználó nem található." };
            }

            return { message: "Felhasználó sikeresen frissítve.", data: response };
        } catch (error) {
            return { message: "Hiba történt a felhasználó frissítése során.", error };
        }
    }
}

module.exports = User;
