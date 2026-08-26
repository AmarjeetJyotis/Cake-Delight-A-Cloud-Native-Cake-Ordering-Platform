const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const gatewayRoutes = require("./routes/gatewayRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "API Gateway",
        message: "Gateway is running successfully"
    });
});

app.use("/", gatewayRoutes);

module.exports = app;