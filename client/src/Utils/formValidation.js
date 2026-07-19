import { z } from 'zod';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const maxSizeBytes = 2 * 1024 * 1024; // 2MB

// Base blog text content rules
const baseBlogSchema = z.object({
  title: z
    .string({ required_error: 'Article title is required' })
    .trim()
    .min(1, 'Article title is required')
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  summary: z
    .string({ required_error: 'Summary is required' })
    .trim()
    .min(1, 'Summary is required')
    .min(50, 'Summary must be at least 50 characters long')
    .max(300, 'Summary cannot exceed 300 characters'),
  content: z
    .string({ required_error: 'Blog content is required' })
    .min(1, 'Blog content is required')
    .refine((val) => {
      // Strip HTML tags and count words
      const textContent = val ? val.replace(/<[^>]*>/g, '').trim() : '';
      const words = textContent ? textContent.split(/\s+/).filter(Boolean) : [];
      return words.length >= 200;
    }, {
      message: 'Content must be at least 200 words long',
    }),
});

// Image schemas
const fileSchema = z
  .any()
  .refine((file) => file !== null && file !== undefined, 'Cover image is required')
  .refine((file) => !file || allowedTypes.includes(file.type), 'Only JPEG, JPG, PNG or WEBP images are allowed')
  .refine((file) => !file || file.size <= maxSizeBytes, 'Image size must be less than 2MB');

const optionalFileSchema = z
  .any()
  .optional()
  .refine((file) => !file || allowedTypes.includes(file.type), 'Only JPEG, JPG, PNG or WEBP images are allowed')
  .refine((file) => !file || file.size <= maxSizeBytes, 'Image size must be less than 2MB');

// Schemas extended for Create vs Edit
export const createBlogSchema = baseBlogSchema.extend({
  file: fileSchema,
});

export const editBlogSchema = baseBlogSchema.extend({
  file: optionalFileSchema,
});

/**
 * Validates blog form parameters using Zod schemas.
 * Returns { isValid, errors } interface for React state compatibility.
 */
export const validateBlogForm = ({ title, summary, content, file, isEdit = false }) => {
  const schema = isEdit ? editBlogSchema : createBlogSchema;
  
  // SafeParse returns success: boolean and error: ZodError if validation fails
  const result = schema.safeParse({ title, summary, content, file });
  
  if (result.success) {
    return { isValid: true, errors: {} };
  } else {
    // Map ZodError list to key-value pairs (e.g. { title: "Title is required" })
    const errors = {};
    const errorList = result.error?.issues || result.error?.errors || [];
    errorList.forEach((err) => {
      const field = err.path[0];
      if (field && !errors[field]) {
        errors[field] = err.message;
      }
    });
    return { isValid: false, errors };
  }
};
