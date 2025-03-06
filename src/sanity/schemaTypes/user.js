const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: true
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'city',
      title: 'City',
      type: 'string'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Kenya'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime'
    },
    {
      name: 'sessions',
      title: 'Sessions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sessionId',
              title: 'Session ID',
              type: 'string'
            },
            {
              name: 'createdAt',
              title: 'Created At',
              type: 'datetime'
            },
            {
              name: 'lastActive',
              title: 'Last Active',
              type: 'datetime'
            }
          ]
        }
      ]
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' }
        ]
      },
      initialValue: 'customer'
    }
  ]
};

export default user;
