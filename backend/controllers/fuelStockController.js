const FuelStock = require('../models/FuelStock');

exports.getStocks = async (req, res) => {
    try {
        const stocks = await FuelStock.getAll();

        // Add percentage calculation
        const stocksWithPercentage = stocks.map(stock => ({
            ...stock,
            percentage: Math.round((stock.current_level / stock.capacity) * 100)
        }));

        res.json(stocksWithPercentage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Simulate IoT update (For demo/testing)
exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { current_level } = req.body;

        await FuelStock.updateLevel(id, current_level);
        res.json({ message: 'Stock updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
