const router = require('express').Router();
const { Product, Review, Category } = require('../db/models');
const Sequelize = require('sequelize');
const isAdmin = require('../middleware');
module.exports = router;

router.get('/', async (req, res, next) => {
  const categoryFilter = req.query.category;
  console.log(req.query);
  try {
    if (req.query.category && req.query.category !== 'null') {
      const filteredProducts = await Product.findAll({
        include: [
          {
            model: Category,
            where: {
              name: {
                [Sequelize.Op.in]: [categoryFilter]
              }
            }
          }
        ]
      });
      res.send(filteredProducts);
    } else {
      const products = await Product.findAll();

      products.map(async product => {
        const productInfo = await Product.findByPk(product.id);
        const avg = await productInfo.getAverageRating();

        await productInfo.update({ avgStar: avg });

        // product.dataValues.avgStar = avg;
        // console.log('dataValues: ', product.dataValues);
      });

      res.json(products);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll();

    products.map(async product => {
      const productInfo = await Product.findByPk(product.id);
      const avg = await productInfo.getAverageRating();

      await productInfo.update({ avgStar: avg });

      // product.dataValues.avgStar = avg;
      // console.log('dataValues: ', product.dataValues);
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review }]
    });

    if (!product) {
      const err = new Error("couldn't find product");
      err.status = 404;
      throw err;
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    next(err);
  }
});

// Priti comment: restrict to admins? --> example below
router.delete('/:productId', isAdmin, async (req, res, next) => {
  try {
    await Product.destroy({
      where: {
        id: req.params.productId
      }
    });
    res.sendStatus(202);
  } catch (err) {
    next(err);
  }
});

// Priti comment: restrict to admins?
router.post('/', async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    next(err);
  }
});

// Priti comment: put route for admins to be able to update product?
