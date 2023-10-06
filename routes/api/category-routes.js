const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
      },
    });
  
    res.status(200).json(categoryData);
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
      },
    });
  
    res.status(200).json(categoryData);
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {
    console.error('Error creating a new tag:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    return res.json(categoryData);
  } catch (error) {
    console.error('Error updating category data:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json('Category Deleted!');
  } catch (error) {
    console.error('Error deleting category data', error);
    res.status(500).send('Internal Service Error');
  }
});

module.exports = router;
