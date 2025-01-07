const sequelize = require("../config/database");

exports.findAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.params.search || ""; // Get the search parameter

    try {
        // Build WHERE clause based on the search parameter
        let whereClause = "";
        let replacements = [limit, offset];

        if (search) {
            whereClause = `WHERE name LIKE ? OR trade_name LIKE ?`;
            const searchParam = `%${search}%`;
            replacements = [searchParam, searchParam, limit, offset];
        }

        // Query to get the total count of products for pagination
        const totalQuery = await sequelize.query(
            `SELECT COUNT(*) as total FROM carriers ${whereClause}`,
            {
                replacements: search ? [replacements[0], replacements[1]] : [],
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const totalQueryQtde = totalQuery[0]?.total || 0;

        // Query to fetch the paginated products
        const query = await sequelize.query(
            `SELECT id, id_exsam, name, trade_name, document, phone FROM carriers
             ${whereClause}
             ORDER BY id DESC
             LIMIT ? OFFSET ?`,
            {
                replacements,
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (query.length === 0) {
            return res.status(404).send({ message: "DATA NOT FOUND" });
        }

        // Return data with pagination
        res.status(200).send({
            status: true,
            message: "The request has succeeded",
            data: {
                transportadoras: query,
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalItems: totalQueryQtde,
                },
            },
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "The request has not succeeded",
            error: error.message, // Included error message for debugging
        });
    }
};






