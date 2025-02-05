const connect = require("../config/db");

const getAllCategories = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `category`", (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető kategóriák." });
        }

        return res.status(200).json({ message: "Kategóriák sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kategóriák lekérése során.", error });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `category` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott kategória nem található." });
        }

        return res.status(200).json({ message: "Kategória sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kategória lekérése során.", error });
    }
};

const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `category` (`id`, `name`) VALUES (NULL, ?);", [name], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Kategória sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kategória létrehozása során.", error });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `category` WHERE `category`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó kategória nem található." });
        }

        return res.status(200).json({ message: "Kategória sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kategória törlése során.", error });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory
};
