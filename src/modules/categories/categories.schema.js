import { z } from "zod";

const categoryNameSchema = z
  .string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser texto",
  })
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(80, "El nombre no puede superar los 80 caracteres");

export const categoryIdParamSchema = z.object({
  id: z.coerce
    .number({
      invalid_type_error: "El id debe ser numerico",
    })
    .int("El id debe ser un entero")
    .positive("El id debe ser mayor a 0"),
});

export const createCategorySchema = z.object({
  name: categoryNameSchema,
});

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
