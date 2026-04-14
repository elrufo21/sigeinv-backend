import { conflict, notFound } from "../../lib/http-error.js";
import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  findCategoryByName,
  hasRelatedProducts,
  updateCategory,
} from "./categories.repository.js";

export async function getAllCategories() {
  return findAllCategories();
}

export async function getCategoryById(categoryId) {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw notFound("Categoria no encontrada");
  }

  return category;
}

export async function createNewCategory(payload) {
  const existingCategory = await findCategoryByName(payload.name);

  if (existingCategory) {
    throw conflict("Ya existe una categoria con ese nombre");
  }

  return createCategory(payload);
}

export async function updateExistingCategory(categoryId, payload) {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw notFound("Categoria no encontrada");
  }

  if (payload.name) {
    const existingCategory = await findCategoryByName(payload.name);

    if (existingCategory && existingCategory.id !== categoryId) {
      throw conflict("Ya existe una categoria con ese nombre");
    }
  }

  return updateCategory(categoryId, payload);
}

export async function deleteExistingCategory(categoryId) {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw notFound("Categoria no encontrada");
  }

  const categoryHasProducts = await hasRelatedProducts(categoryId);

  if (categoryHasProducts) {
    throw conflict("No se puede eliminar una categoria con productos asociados");
  }

  await deleteCategory(categoryId);
}
