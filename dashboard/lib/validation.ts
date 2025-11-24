/**
 * Validation Schemas using Zod
 * Centralized validation for API routes and forms
 */

import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .email('Email non valida')
  .toLowerCase()
  .trim();

// Password validation - stronger requirements
export const passwordSchema = z
  .string()
  .min(8, 'La password deve essere di almeno 8 caratteri')
  .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
  .regex(/[a-z]/, 'La password deve contenere almeno una lettera minuscola')
  .regex(/[0-9]/, 'La password deve contenere almeno un numero')
  .regex(/[^A-Za-z0-9]/, 'La password deve contenere almeno un carattere speciale');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Il nome deve essere di almeno 2 caratteri')
  .max(100, 'Il nome non può superare 100 caratteri')
  .regex(/^[a-zA-Zàèéìòù\s'-]+$/, 'Il nome può contenere solo lettere, spazi, apostrofi e trattini')
  .trim();

// Signup schema (for frontend validation with confirmPassword)
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non coincidono',
  path: ['confirmPassword'],
});

// Signup API schema (for backend - no confirmPassword needed)
export const signupApiSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password obbligatoria'),
});

// Billing checkout schema
export const checkoutSchema = z.object({
  planId: z.enum(['starter', 'pro', 'enterprise'], {
    message: 'Piano non valido',
  }),
});

// Lead status update schema
export const leadStatusSchema = z.object({
  status: z.enum(['nuovo', 'contattato', 'in_trattativa', 'chiuso', 'perso'], {
    message: 'Status non valido',
  }),
});

// Agent creation schema
export const agentSchema = z.object({
  name: nameSchema,
  whatsapp: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Numero WhatsApp non valido (formato: +393491234567)'),
  email: emailSchema.optional(),
  role: z.enum(['owner', 'collaborator']).default('collaborator'),
});

// Zone assignment schema
export const zoneAssignmentSchema = z.object({
  zone: z.string().min(1, 'Zona obbligatoria').trim(),
  agent_id: z.string().min(1, 'ID agente obbligatorio'),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type SignupApiInput = z.infer<typeof signupApiSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type LeadStatusInput = z.infer<typeof leadStatusSchema>;
export type AgentInput = z.infer<typeof agentSchema>;
export type ZoneAssignmentInput = z.infer<typeof zoneAssignmentSchema>;

