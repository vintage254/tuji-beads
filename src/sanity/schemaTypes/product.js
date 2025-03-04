export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        hotspot: true,
      }
    },
    { 
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    { 
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 90,
      }
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Necklaces', value: 'necklaces' },
          { title: 'Bracelets', value: 'bracelets' },
          { title: 'Earrings', value: 'earrings' },
          { title: 'Anklets', value: 'anklets' },
          { title: 'Rings', value: 'rings' },
          { title: 'Sandals', value: 'sandals' },
          { title: 'Home Decor', value: 'home-decor' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Gift Sets', value: 'gift-sets' },
        ],
        layout: 'dropdown'
      },
      validation: Rule => Rule.required()
    },
    { 
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    { 
      name: 'details',
      title: 'Details',
      type: 'string',
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Mark this product as featured to display it prominently',
      initialValue: false
    },
    {
      name: 'trending',
      title: 'Trending Product',
      type: 'boolean',
      description: 'Mark this product as trending to include it in the trending section',
      initialValue: false
    }
  ]
}