import { parseSchema } from "../../lib/validate.js";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./categories.schema.js";
import {
  createNewCategory,
  deleteExistingCategory,
  getAllCategories,
  getCategoryById,
  updateExistingCategory,
} from "./categories.service.js";

export async function getCategories(req, res, next) {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategory(req, res, next) {
  try {
    const { id } = parseSchema(
      categoryIdParamSchema,
      req.params,
      "Parametro id invalido",
    );

    const category = await getCategoryById(id);

    res.status(200).json({
      ok: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const payload = parseSchema(
      createCategorySchema,
      req.body,
      "Payload de categoria invalido",
    );

    const category = await createNewCategory(payload);

    res.status(201).json({
      ok: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = parseSchema(
      categoryIdParamSchema,
      req.params,
      "Parametro id invalido",
    );

    const payload = parseSchema(
      updateCategorySchema,
      req.body,
      "Payload de categoria invalido",
    );

    const category = await updateExistingCategory(id, payload);

    res.status(200).json({
      ok: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = parseSchema(
      categoryIdParamSchema,
      req.params,
      "Parametro id invalido",
    );

    await deleteExistingCategory(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
