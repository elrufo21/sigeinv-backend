import { parseSchema } from "../../lib/validate.js";
import {
  productIdParamSchema,
  createProductSchema,
  updateProductSchema,
} from "./products.schema.js";
import {
  createNewProduct,
  deleteExistingProduct,
  getAllProducts,
  getProductById,
  updateExistingProduct,
} from "./products.service.js";

export async function getProducts(req, res, next) {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      ok: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = parseSchema(
      productIdParamSchema,
      req.params,
      "Parametro id invalido",
    );

    const product = await getProductById(id);

    res.status(200).json({
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const payload = parseSchema(
      createProductSchema,
      req.body,
      "Payload de producto invalido",
    );

    const product = await createNewProduct(payload);

    res.status(201).json({
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = parseSchema(
      productIdParamSchema,
      req.params,
      "Parametro id invalido",
    );

    const payload = parseSchema(
      updateProductSchema,
      req.body,
      "Payload de producto invalido",
    );

    const product = await updateExistingProduct(id, payload);

    res.status(200).json({
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = parseSchema(
      productIdParamSchema,
      req.params,
      "Parametro id invalido",
    );

    await deleteExistingProduct(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
