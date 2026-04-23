import { conflict, notFound } from "../../lib/http-error.js";
import * as repo from "./products.repository.js";

export async function getAllProducts() {
  return repo.findAllProducts();
}

export async function getProductById(id) {
  const product = await repo.findProductById(id);
  if (!product) throw notFound("Producto no encontrado");
  return product;
}

export async function createNewProduct(payload) {
  const existing = await repo.findProductByName(payload.name);
  if (existing) throw conflict("El nombre del producto ya existe");

  return repo.createProduct(payload);
}

export async function updateExistingProduct(id, payload) {
  const product = await repo.findProductById(id);
  if (!product) throw notFound("Producto no encontrado");

  if (payload.name) {
    const existing = await repo.findProductByName(payload.name);
    if (existing && existing.id !== id)
      throw conflict("El nombre ya está en uso");
  }

  return repo.updateProduct(id, payload);
}

export async function deleteExistingProduct(id) {
  const product = await repo.findProductById(id);
  if (!product) throw notFound("Producto no encontrado");

  const hasSales = await repo.hasRelatedSales(id);
  if (hasSales)
    throw conflict("No se puede eliminar: tiene ventas registradas");

  await repo.deleteProduct(id);
}
