export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'product',
            title: 'Product',
            type: 'reference',
            to: [{ type: 'product' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            validation: Rule => Rule.required().min(1)
        },
        {
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
            validation: Rule => Rule.required().min(0)
        },
        {
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Processing', value: 'processing' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' }
                ]
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
            validation: Rule => Rule.required()
        },
        {
            name: 'shippingAddress',
            title: 'Shipping Address',
            type: 'object',
            fields: [
                {
                    name: 'street',
                    title: 'Street',
                    type: 'string'
                },
                {
                    name: 'city',
                    title: 'City',
                    type: 'string'
                },
                {
                    name: 'state',
                    title: 'State/County',
                    type: 'string'
                },
                {
                    name: 'postalCode',
                    title: 'Postal Code',
                    type: 'string'
                },
                {
                    name: 'country',
                    title: 'Country',
                    type: 'string'
                }
            ]
        },
        {
            name: 'notes',
            title: 'Order Notes',
            type: 'text'
        }
    ]
}
