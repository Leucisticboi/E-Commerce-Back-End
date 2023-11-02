const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: Tag,
          attributes: ['tag_name'],
        },
      ],
    });

    res.status(200).json(productData);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send('Internal Service Error');
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: Tag,
          attributes: ['tag_name'],
        },
      ],
    });

    res.status(200).json(productData);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send('Internal Service Error');
  }
});

// create new product
router.post('/', async (req, res) => {
 try {
  const { product_name, price, stock, tagIds } = req.body;

  const newProduct = await Product.create({
    product_name,
    price,
    stock,
    category_id: req.body.category_id,
  });

  if(tagIds && tagIds.length) {
    const productTagIdArr = tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
    }));

    await ProductTag.bulkCreate(productTagIdArr);
  }

  res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating new product:', error);
    res.status(400).json({ error: 'Failed to create the product.' });
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json("Product deleted!");
  } catch (error) {
    console.error('Error deleting product data:', error);
    res.status(500).send('Internal Service Error');
  }
});

module.exports = router;
