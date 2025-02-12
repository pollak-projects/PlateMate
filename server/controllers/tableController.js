const connect = require("../config/db");

const getAllTables = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `tables`", (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető asztalok." });
        }

        return res.status(200).json({ message: "Asztalok sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az asztalok lekérése során.", error });
    }
};

const getTableById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `tables` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott asztal nem található." });
        }

        return res.status(200).json({ message: "Asztal sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az asztal lekérése során.", error });
    }
};

const createTable = async (req, res) => {
    const { tableNumber } = req.body;

    if (!tableNumber) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `tables` (`id`, `tableNumber`) VALUES (NULL, ?);", [tableNumber], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Asztal sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az asztal létrehozása során.", error });
    }
};

const deleteTable = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `tables` WHERE `tables`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó asztal nem található." });
        }

        return res.status(200).json({ message: "Asztal sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az asztal törlése során.", error });
    }
};

module.exports = {
    getAllTables,
    getTableById,
    createTable,
    deleteTable
};
