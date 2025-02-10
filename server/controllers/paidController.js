const connect = require("../config/db");

const getAllPayments = async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    p.id as id,
                    p.tableId as tableId,
                    p.itemId as itemId,
                    p.paymentMethodId as paymentMethodId,
                    p.paidAt as paidAt,
                    i.name as itemName,
                    i.price as itemPrice,
                    t.tableNumber as tableNumber,
                    pm.name as paymentMethodName
                FROM 
                    paid p
                JOIN 
                    item i ON p.itemId = i.id
                JOIN
                    tables t ON p.tableId =t.id
                JOIN 
                    paymentMethods pm ON p.paymentMethodId = pm.id
                `, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!users.length) {
            return res.status(204).json({ message: "Nincsenek elérhető kifizetések." });
        }

        return res.status(200).json({ message: "Kifizetések sikeresen lekérve.", data: users });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kifizetések lekérése során.", error });
    }
};

const getPaymentById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `paid` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott kifizetés nem található." });
        }

        return res.status(200).json({ message: "Kifizetés sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kifizetés lekérése során.", error });
    }
};

const createPayment = async (req, res) => {
    const { tableId, items, paymentMethodId } = req.body;

    if (!tableId || !items || !paymentMethodId) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const results = await Promise.all(
            items.map(async (itemId) => {
                return new Promise((resolve, reject) => {
                    connect.query("INSERT INTO `paid` (`id`, `tableId`, `itemId`, `paymentMethodId`) VALUES (NULL, ?, ?, ?);", [tableId, itemId, paymentMethodId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            })
        );

        return res.status(200).json({ message: "Kifizetés sikeresen létrehozva.", data: results });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kifizetés létrehozása során.", error });
    }
};

const deletePayment = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `paid` WHERE `paid`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó kifizetés nem található." });
        }

        return res.status(200).json({ message: "Kifizetés sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kifizetés törlése során.", error });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    deletePayment
};
