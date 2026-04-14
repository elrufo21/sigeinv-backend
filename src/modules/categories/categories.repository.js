import prisma from "../../lib/prisma.js";

export async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function findCategoryById(categoryId) {
  return prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function findCategoryByName(name) {
  return prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function createCategory(data) {
  return prisma.category.create({
    data,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function updateCategory(categoryId, data) {
  return prisma.category.update({
    where: { id: categoryId },
    data,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function hasRelatedProducts(categoryId) {
  const count = await prisma.product.count({
    where: {
      categoryId,
    },
  });

  return count > 0;
}

export async function deleteCategory(categoryId) {
  return prisma.category.delete({
    where: { id: categoryId },
  });
}
