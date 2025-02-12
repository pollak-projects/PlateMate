const connect = require("../config/db");

const getAllReservations = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    rt.id as id,
                    rt.name as name,
                    rt.numberOfCustomers as numberOfCustomers,
                    rt.tableId as tableId,
                    rt.reservedAt as reservedAt,
                    rt.reservedUntil as reservedUntil, 
                    t.tableNumber as tableNumber
                FROM 
                    reservedtable rt
                JOIN
                    tables t ON  rt.tableId = t.id
                `, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető foglalások." });
        }

        return res.status(200).json({ message: "Foglalások sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a foglalások lekérése során.", error });
    }
};

const getReservationById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    rt.id as id,
                    rt.name as name,
                    rt.numberOfCustomers as numberOfCustomers,
                    rt.tableId as tableId,
                    rt.reservedAt as reservedAt,
                    rt.reservedUntil as reservedUntil, 
                    t.tableNumber as tableNumber
                FROM 
                    reservedtable rt
                JOIN
                    tables t ON  rt.tableId = t.id
                WHERE
                    rt.id = ?
                `, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott foglalás nem található." });
        }

        return res.status(200).json({ message: "Foglalás sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a foglalás lekérése során.", error });
    }
};

const getAllReservationsOnDay = async (req, res) => {
    const { tableNumber, fromDate } = req.query;
    let tableId = 0

    if (!tableNumber || !fromDate) {
        return res.status(400).json({ message: "Az adatok megadása kötelező." });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            connect.query("SELECT id FROM `tables` WHERE `tableNumber` = ?", [tableNumber], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!result.length) {
            return res.status(204).json({ message: "A megadott asztal nem található." });
        }

        tableId = result[0].id
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az asztal lekérése során.", error });
    }

    try {
        const reservations = await new Promise((resolve, reject) => {
            connect.query(`
                    SELECT 
                        * 
                    FROM
                        reservedtable 
                    WHERE 
                        tableId = ? AND 
                        DATE(reservedAt) = ?;
                `, [tableId, fromDate], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!reservations.length) {
            return res.status(204).json({ message: "A megadott napra foglalás nem található." });
        }

        return res.status(200).json({ message: "Foglalások sikeresen lekérve.", data: reservations });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a foglalások lekérése során.", error });
    }
};

const createReservation = async (req, res) => {
    const { tableNumber, name, numberOfCustomers, reservedAt, reservedUntil } = req.body;
    let tableId = 0;

    if (!tableNumber || !name || !numberOfCustomers || !reservedAt || !reservedUntil) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            connect.query("SELECT id FROM `tables` WHERE `tableNumber` = ?", [tableNumber], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!result.length) {
            return res.status(204).json({ message: "A megadott asztal nem található." });
        }

        tableId = result[0].id
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az asztal lekérése során.", error });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("INSERT INTO `reservedTable` (`id`, `tableId`, `name`, `numberOfCustomers`, `reservedAt`, `reservedUntil`) VALUES (NULL, ?, ?, ?, ?, ?);", [tableId, name, numberOfCustomers, reservedAt, reservedUntil], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({ message: "Foglalás sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a foglalás létrehozása során.", error });
    }
};

const deleteReservation = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `reservedtable` WHERE `reservedtable`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó foglalás nem található." });
        }

        return res.status(200).json({ message: "Foglalás sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a foglalás törlése során.", error });
    }
};

module.exports = {
    getAllReservations,
    getReservationById,
    getAllReservationsOnDay,
    createReservation,
    deleteReservation
};
