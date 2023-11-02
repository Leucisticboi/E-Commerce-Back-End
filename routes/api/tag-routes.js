const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagsData = await Tag.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
        through: {
          attributes: ['id'],
        },
      },
    });

    res.status(200).json(tagsData);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
        through: {
          attributes: ['id'],
        },
      },
    });

    res.status(200).json(tagData);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);

    res.status(200).json(newTag);
  } catch (error) {
    console.error('Error creating a new tag:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );

    const updatedTag = await Tag.findOne({
      where: {
        id: req.params.id,
      },
    });

    return res.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag data:', error);
    res.status(500).send('Internal Service Error');
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
  
    return res.json("Tag deleted!");
  } catch (error) {
    console.error('Error deleting tag data:', error);
    res.status(500).send('Internal Service Error');
  }  
});

module.exports = router;
