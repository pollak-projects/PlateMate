const connect = require("../config/db");

const getAllSettings = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `permissionsettings`", (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető jogok." });
        }

        return res.status(200).json({ message: "Jogok sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a jogok lekérése során.", error });
    }
};

const getSettingById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `permissionsettings` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott jog nem található." });
        }

        return res.status(200).json({ message: "Jog sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a jog lekérése során.", error });
    }
};

const createSetting = async (req, res) => {
    const { section } = req.body;

    if (!section) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `permissionsettings` (`id`, `section`) VALUES (NULL, ?);", [section], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Jog sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a jog létrehozása során.", error });
    }
};

const deleteSetting = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `permissionsettings` WHERE `permissionsettings`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó jog nem található." });
        }

        return res.status(200).json({ message: "Jog sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a jog törlése során.", error });
    }
};

module.exports = {
    getAllSettings,
    getSettingById,
    createSetting,
    deleteSetting
};
