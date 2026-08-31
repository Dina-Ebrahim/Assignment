import express from "express";
import { bootstrapDB } from "./DB/connection.db.js";
import { productController } from "./modules/index.js";
import { supplierController } from "./modules/index.js";
import { saleController } from "./modules/index.js";
import { globalErrorHandling } from "./middelware/index.js";
import { modificationcontroller } from "./modules/index.js";
const app = express();
const port = 3000;
app.use(express.json());

app.use("/products", productController);
app.use("/supplier", supplierController);
app.use("/sale", saleController);
app.use("/modification", modificationcontroller);
app.use(globalErrorHandling);
bootstrapDB(app, port);
//postman
//https://ebrahimd375-4267788.postman.co/workspace/Dina-Ebrahim's-Workspace~cc2a78ac-31ff-4c03-8bc6-6c20069f6df4/collection/57065343-0ad81e41-65c2-4cc8-a76c-fdfdab1c8f57?action=share&source=copy-link&creator=57065343
