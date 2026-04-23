import { z } from "zod";

const productNameSchema = z
  .string({ required_error: "El nombre es obligatorio" })
  .trim()
  .min(2, "Mínimo 2 caracteres")
  .max(80);

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID inválido"),
});

export const createProductSchema = z.object({
  name: productNameSchema,
  description: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  categoryId: z.number().int().positive("La categoría es obligatoria"),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo",
  });
