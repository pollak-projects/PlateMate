const connect = require("../config/db");

const getAllOpeningHours = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM openinghours`, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető időpontok." });
        }

        return res.status(200).json({ message: "Időpontok sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az időpontok lekérése során.", error });
    }
};

const createOpeningHour = async (req, res) => {
    const { day, from, until } = req.body;

    if (!day || !from || !until) {

        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `openinghours` (`id`, `dayName`, `fromHour`, `untilHour`) VALUES (NULL, ?, ?, ?);", [day, from, until], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Időpont sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az időpont létrehozása során.", error });
    }
};

const deleteOpeningHour = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `openinghours` WHERE `openinghours`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó időpont nem található." });
        }

        return res.status(200).json({ message: "Időpont sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az időpont törlése során.", error });
    }
};

module.exports = {
    getAllOpeningHours,
    createOpeningHour,
    deleteOpeningHour
};
