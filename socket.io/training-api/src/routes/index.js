const express = require('express');
const config = require('../config/config');
const docsRoute = require('./docs.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const shopRoute = require('./shop.route');
const customerAuthRoute = require('./customer-auth.route');
const customerRoute = require('./customer.route');
const customerOrderRoute = require('./customer-order.route')
const userOrderRoute = require('./user-order.route')
const chatRoute = require('./chat.route')

const router = express.Router();

// Routes index
const defaultRoutes = [{
  path: '/auth',    // base path for auth routes
  route: authRoute,
}, {
  path: '/users',   // base path for user routes
  route: userRoute,
}, {
  path: '/products',   // base path for product routes
  route: productRoute,
}, {
  path: '/shop',   // base path for shop routes
  route: shopRoute,
}, {
  path: '/shop/auth',    // base path for customer auth routes
  route: customerAuthRoute,
}, {
  path: '/customers',    // base path for customer auth routes
  route: customerRoute,
},{
  path:'/shop/orders',
  route:customerOrderRoute,
},{
  path:'/orders',
  route:userOrderRoute
},{
  path:'/chats',
  route:chatRoute
}];

// Swagger documentation route available only in development mode
const devRoutes = [{
  path: '/docs',
  route: docsRoute,
},];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;