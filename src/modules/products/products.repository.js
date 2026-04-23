import prisma from "../../lib/prisma.js";

const productSelect = {
  id: true,
  name: true,
  description: true,
  stock: true,
  price: true,
  categoryId: true,
  category: { select: { name: true } },
  createdAt: true,
};

export async function findAllProducts() {
  return prisma.product.findMany({
    orderBy: { id: "desc" },
    select: productSelect,
  });
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });
}

export async function findProductByName(name) {
  return prisma.product.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
}

export async function createProduct(data) {
  return prisma.product.create({
    data,
    select: productSelect,
  });
}

export async function updateProduct(id, data) {
  return prisma.product.update({
    where: { id },
    data,
    select: productSelect,
  });
}

export async function hasRelatedSales(productId) {
  const count = await prisma.saleDetail.count({
    where: { productId },
  });
  return count > 0;
}

export async function deleteProduct(id) {
  return prisma.product.delete({ where: { id } });
}
