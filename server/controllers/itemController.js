const connect = require("../config/db");

const getAllItems = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT
                    i.id as id, 
                    i.name as name,
                    i.price as price,
                    i.categoryId as categoryId,
                    c.name as categoryName
                FROM 
                    item i
                JOIN 
                    category c ON i.categoryId = c.id
                `, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető ételek." });
        }

        return res.status(200).json({ message: "Ételek sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az ételek lekérése során.", error });
    }
};

const getItemById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `item` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott étel nem található." });
        }

        return res.status(200).json({ message: "Étel sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az étel lekérése során.", error });
    }
};

const createItem = async (req, res) => {
    const { name, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `item` (`id`, `name`, `price`, `categoryId`) VALUES (NULL, ?, ?, ?);", [name, price, categoryId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Étel sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az étel létrehozása során.", error });
    }
};

const deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `item` WHERE `item`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó étel nem található." });
        }

        return res.status(200).json({ message: "Étel sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az étel törlése során.", error });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    deleteItem
};
