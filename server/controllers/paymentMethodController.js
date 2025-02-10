const connect = require("../config/db");

const getAllMethods = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `paymentmethods`", (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető fizetési módszerek." });
        }

        return res.status(200).json({ message: "Fizetési módszerek sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a fizetési módszerek lekérése során.", error });
    }
};

const getMethodById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `paymentmethods` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott fizetési módszer nem található." });
        }

        return res.status(200).json({ message: "Fizetési módszer sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a fizetési módszer lekérése során.", error });
    }
};

const createMethod = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `paymentmethods` (`id`, `name`) VALUES (NULL, ?);", [name], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Fizetési módszer sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a fizetési módszer létrehozása során.", error });
    }
};

const deleteMethod = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `paymentmethods` WHERE `paymentmethods`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó fizetési módszer nem található." });
        }

        return res.status(200).json({ message: "Fizetési módszer sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a fizetési módszer törlése során.", error });
    }
};

module.exports = {
    getAllMethods,
    getMethodById,
    createMethod,
    deleteMethod
};
