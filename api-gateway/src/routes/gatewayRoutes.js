const express = require("express");

const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");

const gatewayConfig = require("../config/gatewayConfig");

const router = express.Router();

// Catalog Service

router.use(
  "/catalog",
  createProxyMiddleware({
    target: gatewayConfig.catalogService,
    changeOrigin: true,

    on: {
      proxyReq: fixRequestBody,
    },
  }),
);

// Order Service
router.use(
  "/orders",
  createProxyMiddleware({
    target: gatewayConfig.orderService,
    changeOrigin: true,

    on: {
      proxyReq: fixRequestBody,
    },
  }),
);

// Rating Service

router.use(
  "/ratings",
  createProxyMiddleware({
    target: gatewayConfig.ratingService,
    changeOrigin: true,

    on: {
      proxyReq: fixRequestBody,
    },

    pathRewrite: (path) => {
      return "/ratings" + path;
    },
  }),
);

// Notification Service
router.use(
  "/notifications",
  createProxyMiddleware({
    target: gatewayConfig.notificationService,
    changeOrigin: true,

    on: {
      proxyReq: fixRequestBody,
    },

    pathRewrite: (path) => {
      return "/notifications" + path;
    },
  }),
);

module.exports = router;
