const connect = require("../config/db");

const getAllOrders = async (req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `orders`", (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!response.length) {
            return res.status(204).json({ message: "Nincsenek elérhető rendelések." });
        }

        return res.status(200).json({ message: "Rendelések sikeresen lekérve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelések lekérése során.", error });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            connect.query("SELECT * FROM `orders` WHERE `id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user.length) {
            return res.status(204).json({ message: "A megadott rendelés nem található." });
        }

        return res.status(200).json({ message: "Rendelés sikeresen lekérve.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés lekérése során.", error });
    }
};

const createOrder = async (req, res) => {
    const { tableId, items } = req.body;

    if (!tableId || !items) {
        return res.status(400).json({ message: "Minden mező megadása kötelező." });
    }

    try {
        const response = await Promise.all(
            items.map(async (itemId) => {
                return new Promise((resolve, reject) => {
                    connect.query("INSERT INTO `orders` (`id`, `tableId`, `itemId`) VALUES (NULL, ?, ?);", [tableId, itemId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            })
        );

        return res.status(200).json({ message: "Rendelés sikeresen létrehozva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés létrehozása során.", error });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query("DELETE FROM `orders` WHERE `orders`.`id` = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (response.affectedRows === 0) {
            return res.status(204).json({ message: "A megadott ID-hoz tartozó rendelés nem található." });
        }

        return res.status(200).json({ message: "Rendelés sikeresen törölve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés törlése során.", error });
    }
};

const deleteOrderByArray = async (req, res) => {
    const { items } = req.body;

    if (!items) {
        return res.status(400).json({ message: "Az ID-k megadása kötelező." });
    }

    try {
        const response = await Promise.all(
            items.map(async (itemId) => {
                return new Promise((resolve, reject) => {
                    connect.query("DELETE FROM `orders` WHERE `orders`.`id` = ?", [itemId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            })
        );

        response.forEach((result) => {
            if (!res.headersSent && result.affectedRows === 0) res.status(204).json({ message: "Rendelés nem található." });
        });

        if (!res.headersSent) return res.status(200).json({ message: "Rendelések sikeresen törölve.", data: response });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Hiba történt a rendelések törlése során.", error });
    }
};

const getAllInProcessOrders = async (req, res) => {
    try {
        const orders = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    o.id as id,
                    o.tableId as tableId,
                    o.itemId as itemId,
                    o.orderedAt as orderedAt, 
                    i.name as itemName, 
                    i.categoryId as itemCategoryId,
                    t.tableNumber as tableNumber,
                    c.id as categoryId,
                    c.name as categoryName
                FROM 
                    orders o
                JOIN 
                    item i  ON o.itemId = i.id 
                JOIN
                	category c ON i.categoryId = c.id
                JOIN
                    tables t ON o.tableId = t.id
                WHERE 
                    isDone = false AND
                    c.name != "drink"
                    `, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!orders.length) {
            return res.status(204).json({ message: "Nincsenek elérhető készülő rendelések." });
        }

        return res.status(200).json({ message: "Készülő rendelések sikeresen lekérve.", data: orders });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a készülő rendelések lekérése során.", error });
    }
};

const getAllFinishedOrders = async (req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    o.id as id,
                    o.tableId as tableId,
                    o.itemId as itemId,
                    o.orderedAt as orderedAt, 
                    i.name as itemName, 
                    i.categoryId as itemCategoryId,
                    t.tableNumber as tableNumber,
                    c.id as categoryId,
                    c.name as categoryName
                FROM 
                    orders o
                JOIN 
                    item i  ON o.itemId = i.id 
                JOIN
                	category c ON i.categoryId = c.id
                JOIN
                    tables t ON o.tableId = t.id
                WHERE 
                    (isDone = true AND 
                    isServed = false) or
                    (c.name = "drink" AND 
                    isServed = false)
                    `, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!response.length) {
            return res.status(204).json({ message: "Nincsenek elérhető kész rendelések." });
        }

        return res.status(200).json({ message: "Kész rendelések sikeresen lekérve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kész rendelések lekérése során.", error });
    }
};

const getAllServedOrders = async (req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    o.id as id,
                    o.tableId as tableId,
                    o.itemId as itemId,
                    o.orderedAt as orderedAt, 
                    i.name as itemName, 
                    t.tableNumber as tableNumber
                FROM 
                    orders o
                JOIN 
                    item i  ON o.itemId = i.id 
                JOIN
                    tables t ON o.tableId = t.id
                WHERE 
                    isServed = true
                    `, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!response.length) {
            return res.status(204).json({ message: "Nincsenek elérhető kész rendelések." });
        }

        return res.status(200).json({ message: "Kész rendelések sikeresen lekérve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kész rendelések lekérése során.", error });
    }
};

const setDoneOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`UPDATE orders SET isDone = true WHERE id = ?`, id, (err, result) => {

                if (err) reject(err);
                else resolve(result);
            });
        });

        if(response.affectedRows == 0) return res.status(204).json({ message: "A megadott ID-hoz tartozó rendelés nem található." });

        return res.status(200).json({ message: "Rendelés sikeresen átállitva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés átállitása során.", error });
    }
};

const rollbackDoneOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`UPDATE orders SET isDone = false WHERE id = ?`, id, (err, result) => {

                if (err) reject(err);
                else resolve(result);
            });
        });

        if(response.affectedRows == 0) return res.status(204).json({ message: "A megadott ID-hoz tartozó rendelés nem található." });

        return res.status(200).json({ message: "Rendelés sikeresen visszaállitva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés visszaállitása során.", error });
    }
};

const setServedOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`UPDATE orders SET isServed = true WHERE id = ?`, id, (err, result) => {

                if (err) reject(err);
                else resolve(result);
            });
        });

        if(response.affectedRows == 0) return res.status(204).json({ message: "A megadott ID-hoz tartozó rendelés nem található." });

        return res.status(200).json({ message: "Rendelés sikeresen átállitva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés átállitva során.", error });
    }
};

const rollbackServedOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`UPDATE orders SET isServed = false WHERE id = ?`, id, (err, result) => {

                if (err) reject(err);
                else resolve(result);
            });
        });

        if(response.affectedRows == 0) return res.status(204).json({ message: "A megadott ID-hoz tartozó rendelés nem található." });

        return res.status(200).json({ message: "Rendelés sikeresen visszaállitva.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a rendelés visszaállitása során.", error });
    }
};

const getOrdersByTableId = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Az ID megadása kötelező." });
    }

    try {
        const response = await new Promise((resolve, reject) => {
            connect.query(`
                SELECT 
                    o.id as id,
                    o.tableId as tableId,
                    o.itemId as itemId,
                    o.orderedAt as orderedAt, 
                    i.id as  itemId,
                    i.name as itemName,
                    i.price as itemPrice,
                    t.tableNumber as tableNumber
                FROM 
                    orders o
                JOIN 
                    item i  ON o.itemId = i.id 
                JOIN
                    tables t ON o.tableId = t.id
                WHERE 
                    t.id  = ?
                    `, id, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!response.length) {
            return res.status(204).json({ message: "Nincsenek elérhető kész rendelések." });
        }

        return res.status(200).json({ message: "Kész rendelések sikeresen lekérve.", data: response });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a kész rendelések lekérése során.", error });
    }
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    deleteOrderByArray,
    getAllInProcessOrders,
    getAllFinishedOrders,
    getAllServedOrders,
    setDoneOrder,
    rollbackDoneOrder,
    setServedOrder,
    rollbackServedOrder,
    getOrdersByTableId
};
