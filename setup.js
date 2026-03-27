#!/usr/bin/env node
/**
 * TrueApp monorepo scaffold script.
 * Run once from the repo root: node setup.js
 *
 * What it does:
 *  1. Creates all directories
 *  2. Writes all source files
 *  3. Runs pnpm install (or npm install as fallback)
 *
 * After it finishes, delete this file and commit.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = __dirname;

// ─── helpers ──────────────────────────────────────────────────────────────────
function write(relPath, content) {
  const full = path.join(root, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  if (!fs.existsSync(full)) {
    fs.writeFileSync(full, content, 'utf8');
    console.log(`  ✏  ${relPath}`);
  } else {
    console.log(`  ⏭  ${relPath} (exists, skipped)`);
  }
}

// ─── packages/shared ──────────────────────────────────────────────────────────
write('packages/shared/package.json', JSON.stringify({
  name: '@trueapp/shared',
  version: '0.0.1',
  private: true,
  main: './src/index.ts',
  types: './src/index.ts',
  exports: { '.': './src/index.ts' },
}, null, 2));

write('packages/shared/tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: { outDir: './dist', rootDir: './src' },
  include: ['src'],
}, null, 2));

write('packages/shared/src/index.ts', `// Re-export all shared modules
export * from './types';
export * from './schemas';
`);

write('packages/shared/src/types.ts', `// Core domain types shared across web, mobile, and API

export type UserRole = 'user' | 'moderator' | 'admin';
export type Platform = 'ios' | 'android' | 'both' | 'web';
export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isPremium: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface AppCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export interface App {
  id: string;
  name: string;
  slug: string;
  description: string;
  developerName: string;
  categoryId: string;
  category?: AppCategory;
  platform: Platform;
  logoUrl?: string;
  websiteUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  averageTrueScore: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  appId: string;
  app?: Pick<App, 'id' | 'name' | 'slug' | 'logoUrl'>;
  trueScore: number;          // 1-10 overall TrueScore
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  pricingClarity: number;     // 1-5: how clear/fair is pricing?
  dataPrivacyRating: number;  // 1-5: privacy practices
  darkPatternRating: number;  // 1-5: absence of dark patterns (5 = none)
  overallSatisfaction: number; // 1-5
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  createdAt: string;
}

// ─── API response shapes ───────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ─── Auth shapes ──────────────────────────────────────────────────────────────
export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token?: string; // only returned for mobile (JWT); web uses HttpOnly cookie
}
`);

write('packages/shared/src/schemas.ts', `import { z } from 'zod';

// ─── Auth schemas ──────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

// ─── Review schemas ────────────────────────────────────────────────────────────
export const createReviewSchema = z.object({
  appId: z.string().uuid(),
  trueScore: z.number().int().min(1).max(10),
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  body: z.string().min(20, 'Review must be at least 20 characters').max(5000),
  pros: z.array(z.string().max(200)).max(10).default([]),
  cons: z.array(z.string().max(200)).max(10).default([]),
  pricingClarity: z.number().int().min(1).max(5),
  dataPrivacyRating: z.number().int().min(1).max(5),
  darkPatternRating: z.number().int().min(1).max(5),
  overallSatisfaction: z.number().int().min(1).max(5),
  isVerifiedPurchase: z.boolean().default(false),
});

// ─── App schemas ───────────────────────────────────────────────────────────────
export const submitAppSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(20).max(2000),
  developerName: z.string().min(1).max(100),
  categoryId: z.string().uuid(),
  platform: z.enum(['ios', 'android', 'both', 'web']),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  appStoreUrl: z.string().url().optional().or(z.literal('')),
  playStoreUrl: z.string().url().optional().or(z.literal('')),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type SubmitAppInput = z.infer<typeof submitAppSchema>;
`);

// ─── packages/api-client ──────────────────────────────────────────────────────
write('packages/api-client/package.json', JSON.stringify({
  name: '@trueapp/api-client',
  version: '0.0.1',
  private: true,
  main: './src/index.ts',
  types: './src/index.ts',
  exports: { '.': './src/index.ts' },
  dependencies: { '@trueapp/shared': 'workspace:*' },
}, null, 2));

write('packages/api-client/tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: { outDir: './dist', rootDir: './src' },
  include: ['src'],
}, null, 2));

write('packages/api-client/src/index.ts', `export { createApiClient } from './client';
export type { ApiClientOptions } from './client';
`);

write('packages/api-client/src/client.ts', `import type {
  App,
  User,
  Review,
  AppCategory,
  PaginatedResponse,
  LoginResponse,
} from '@trueapp/shared';
import type { RegisterInput, LoginInput, CreateReviewInput, SubmitAppInput } from '@trueapp/shared';

export interface ApiClientOptions {
  baseUrl: string;
  /** Supply a token getter for mobile (JWT). Web relies on HttpOnly cookies. */
  getToken?: () => string | null | undefined;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient(options: ApiClientOptions) {
  const { baseUrl, getToken } = options;

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = getToken?.();
    if (token) headers['Authorization'] = \`Bearer \${token}\`;

    const res = await fetch(\`\${baseUrl}\${path}\`, {
      method,
      headers,
      credentials: 'include', // for web cookie-based auth
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, err.error ?? 'UNKNOWN', err.message ?? res.statusText);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  return {
    // ─── Auth ───────────────────────────────────────────────────────────────
    auth: {
      register: (data: RegisterInput) =>
        request<LoginResponse>('POST', '/api/auth/register', data),
      login: (data: LoginInput) =>
        request<LoginResponse>('POST', '/api/auth/login', data),
      logout: () => request<void>('POST', '/api/auth/logout'),
      me: () => request<User>('GET', '/api/auth/me'),
    },

    // ─── Apps ───────────────────────────────────────────────────────────────
    apps: {
      list: (params?: { page?: number; pageSize?: number; category?: string; platform?: string; search?: string }) => {
        const qs = new URLSearchParams();
        if (params?.page) qs.set('page', String(params.page));
        if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
        if (params?.category) qs.set('category', params.category);
        if (params?.platform) qs.set('platform', params.platform);
        if (params?.search) qs.set('search', params.search);
        return request<PaginatedResponse<App>>('GET', \`/api/apps?\${qs}\`);
      },
      get: (slug: string) => request<App>('GET', \`/api/apps/\${slug}\`),
      submit: (data: SubmitAppInput) => request<App>('POST', '/api/apps', data),
      featured: () => request<App[]>('GET', '/api/apps/featured'),
    },

    // ─── Reviews ────────────────────────────────────────────────────────────
    reviews: {
      list: (appId: string, params?: { page?: number; pageSize?: number }) => {
        const qs = new URLSearchParams({ appId });
        if (params?.page) qs.set('page', String(params.page));
        if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
        return request<PaginatedResponse<Review>>('GET', \`/api/reviews?\${qs}\`);
      },
      create: (data: CreateReviewInput) =>
        request<Review>('POST', '/api/reviews', data),
      vote: (reviewId: string, helpful: boolean) =>
        request<void>('POST', \`/api/reviews/\${reviewId}/vote\`, { helpful }),
    },

    // ─── Categories ─────────────────────────────────────────────────────────
    categories: {
      list: () => request<AppCategory[]>('GET', '/api/categories'),
    },

    // ─── Users ──────────────────────────────────────────────────────────────
    users: {
      profile: (username: string) => request<User>('GET', \`/api/users/\${username}\`),
      reviews: (username: string) =>
        request<PaginatedResponse<Review>>('GET', \`/api/users/\${username}/reviews\`),
    },
  };
}

export type TrueAppApiClient = ReturnType<typeof createApiClient>;
`);

// ─── apps/api ─────────────────────────────────────────────────────────────────
write('apps/api/package.json', JSON.stringify({
  name: '@trueapp/api',
  version: '0.0.1',
  private: true,
  scripts: {
    dev: 'tsx watch src/index.ts',
    build: 'tsc',
    start: 'node dist/index.js',
    'db:push': 'drizzle-kit push',
    'db:studio': 'drizzle-kit studio',
    'db:generate': 'drizzle-kit generate',
    typecheck: 'tsc --noEmit',
  },
  dependencies: {
    '@trueapp/shared': 'workspace:*',
    'express': '^4.19.2',
    'cors': '^2.8.5',
    'helmet': '^7.1.0',
    'morgan': '^1.10.0',
    'cookie-parser': '^1.4.6',
    'bcryptjs': '^2.4.3',
    'jsonwebtoken': '^9.0.2',
    'zod': '^3.23.0',
    'drizzle-orm': '^0.30.10',
    'pg': '^8.11.5',
    'dotenv': '^16.4.5',
    'stripe': '^15.5.0',
  },
  devDependencies: {
    '@types/express': '^4.17.21',
    '@types/cors': '^2.8.17',
    '@types/morgan': '^1.9.9',
    '@types/cookie-parser': '^1.4.7',
    '@types/bcryptjs': '^2.4.6',
    '@types/jsonwebtoken': '^9.0.6',
    '@types/pg': '^8.11.6',
    '@types/node': '^20.0.0',
    'tsx': '^4.7.3',
    'drizzle-kit': '^0.21.4',
    'typescript': '^5.4.5',
  },
}, null, 2));

write('apps/api/tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    target: 'ES2022',
    module: 'CommonJS',
    moduleResolution: 'Node',
    outDir: './dist',
    rootDir: './src',
  },
  include: ['src'],
}, null, 2));

write('apps/api/drizzle.config.ts', `import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`);

write('apps/api/src/index.ts', `import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(\`🚀 TrueApp API running on http://localhost:\${PORT}\`);
});
`);

write('apps/api/src/app.ts', `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import appsRoutes from './routes/apps';
import reviewsRoutes from './routes/reviews';
import categoriesRoutes from './routes/categories';
import usersRoutes from './routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Global middleware ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
`);

write('apps/api/src/db/index.ts', `import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
`);

write('apps/api/src/db/schema.ts', `import {
  pgTable,
  text,
  varchar,
  integer,
  smallint,
  boolean,
  decimal,
  timestamp,
  uuid,
  pgEnum,
  json,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['user', 'moderator', 'admin']);
export const platformEnum = pgEnum('platform', ['ios', 'android', 'both', 'web']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'pro']);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'canceled', 'past_due', 'trialing',
]);

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  username: varchar('username', { length: 30 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  isPremium: boolean('is_premium').notNull().default(false),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  emailIdx: uniqueIndex('users_email_idx').on(t.email),
  usernameIdx: uniqueIndex('users_username_idx').on(t.username),
}));

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  iconName: varchar('icon_name', { length: 50 }).notNull().default('grid'),
}, (t) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(t.slug),
}));

// ─── Apps ─────────────────────────────────────────────────────────────────────
export const apps = pgTable('apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull(),
  description: text('description').notNull(),
  developerName: varchar('developer_name', { length: 100 }).notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  platform: platformEnum('platform').notNull().default('both'),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  appStoreUrl: text('app_store_url'),
  playStoreUrl: text('play_store_url'),
  averageTrueScore: decimal('average_true_score', { precision: 4, scale: 2 }).notNull().default('0'),
  totalReviews: integer('total_reviews').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  submittedByUserId: uuid('submitted_by_user_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  slugIdx: uniqueIndex('apps_slug_idx').on(t.slug),
  categoryIdx: index('apps_category_idx').on(t.categoryId),
  featuredIdx: index('apps_featured_idx').on(t.isFeatured),
}));

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  appId: uuid('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
  trueScore: smallint('true_score').notNull(),          // 1-10
  title: varchar('title', { length: 150 }).notNull(),
  body: text('body').notNull(),
  pros: json('pros').$type<string[]>().notNull().default([]),
  cons: json('cons').$type<string[]>().notNull().default([]),
  pricingClarity: smallint('pricing_clarity').notNull(),    // 1-5
  dataPrivacyRating: smallint('data_privacy_rating').notNull(), // 1-5
  darkPatternRating: smallint('dark_pattern_rating').notNull(), // 1-5
  overallSatisfaction: smallint('overall_satisfaction').notNull(), // 1-5
  isVerifiedPurchase: boolean('is_verified_purchase').notNull().default(false),
  helpfulVotes: integer('helpful_votes').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  userAppIdx: uniqueIndex('reviews_user_app_idx').on(t.userId, t.appId),
  appIdx: index('reviews_app_idx').on(t.appId),
  userIdx: index('reviews_user_idx').on(t.userId),
}));

// ─── Review votes ─────────────────────────────────────────────────────────────
export const reviewVotes = pgTable('review_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  helpful: boolean('helpful').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  userReviewIdx: uniqueIndex('review_votes_user_review_idx').on(t.userId, t.reviewId),
}));

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  plan: subscriptionPlanEnum('plan').notNull().default('free'),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many, one }) => ({
  reviews: many(reviews),
  submittedApps: many(apps),
  subscription: one(subscriptions, { fields: [users.id], references: [subscriptions.userId] }),
  votes: many(reviewVotes),
}));

export const appsRelations = relations(apps, ({ one, many }) => ({
  category: one(categories, { fields: [apps.categoryId], references: [categories.id] }),
  reviews: many(reviews),
  submittedBy: one(users, { fields: [apps.submittedByUserId], references: [users.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  app: one(apps, { fields: [reviews.appId], references: [apps.id] }),
  votes: many(reviewVotes),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  apps: many(apps),
}));
`);

write('apps/api/src/lib/jwt.ts', `import jwt from 'jsonwebtoken';
import type { AuthTokenPayload } from '@trueapp/shared';

const secret = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, secret) as AuthTokenPayload;
}
`);

write('apps/api/src/middleware/errorHandler.ts', `import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode ?? 500;
  const errorCode = err.errorCode ?? 'INTERNAL_ERROR';
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  if (statusCode === 500) {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({ error: errorCode, message });
}

export function createError(message: string, statusCode = 400, errorCode = 'BAD_REQUEST'): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.errorCode = errorCode;
  return err;
}
`);

write('apps/api/src/middleware/auth.ts', `import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import type { AuthTokenPayload } from '@trueapp/shared';
import { createError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    // Try Authorization header (mobile) first, then cookie (web)
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.cookies?.token;

    if (!token) throw createError('Authentication required', 401, 'UNAUTHORIZED');

    req.user = verifyToken(token);
    next();
  } catch (err: any) {
    if (err.statusCode) return next(err);
    next(createError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(createError('Authentication required', 401, 'UNAUTHORIZED'));
    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403, 'FORBIDDEN'));
    }
    next();
  };
}
`);

write('apps/api/src/middleware/validate.ts', `import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { createError } from './errorHandler';

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join('; ');
      return next(createError(message, 422, 'VALIDATION_ERROR'));
    }
    req.body = result.data;
    next();
  };
}
`);

write('apps/api/src/routes/auth.ts', `import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema';
import { signToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { registerSchema, loginSchema } from '@trueapp/shared';
import { eq } from 'drizzle-orm';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) throw createError('Email already in use', 409, 'EMAIL_TAKEN');

    const [existingUsername] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername) throw createError('Username already taken', 409, 'USERNAME_TAKEN');

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({ email, username, passwordHash })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        isPremium: users.isPremium,
        createdAt: users.createdAt,
      });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    // Web: HttpOnly cookie; Mobile: also return token in body
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: { ...user, avatarUrl: null, bio: null }, token });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        isPremium: users.isPremium,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user!.userId))
      .limit(1);

    if (!user) throw createError('User not found', 404, 'NOT_FOUND');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
`);

write('apps/api/src/routes/categories.ts', `import { Router } from 'express';
import { db } from '../db';
import { categories } from '../db/schema';

const router = Router();

// GET /api/categories
router.get('/', async (_req, res, next) => {
  try {
    const rows = await db.select().from(categories).orderBy(categories.name);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
`);

write('apps/api/src/routes/apps.ts', `import { Router } from 'express';
import { db } from '../db';
import { apps, categories } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { submitAppSchema } from '@trueapp/shared';
import { eq, ilike, and, sql } from 'drizzle-orm';

const router = Router();

// GET /api/apps/featured
router.get('/featured', async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(apps)
      .where(eq(apps.isFeatured, true))
      .limit(6);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/apps
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1')));
    const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize ?? '20'))));
    const offset = (page - 1) * pageSize;
    const search = req.query.search as string | undefined;
    const categorySlug = req.query.category as string | undefined;
    const platform = req.query.platform as string | undefined;

    const conditions = [];
    if (search) conditions.push(ilike(apps.name, \`%\${search}%\`));
    if (platform) conditions.push(eq(apps.platform, platform as any));
    if (categorySlug) {
      const [cat] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      if (cat) conditions.push(eq(apps.categoryId, cat.id));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ count }] = await db
      .select({ count: sql<number>\`count(*)\` })
      .from(apps)
      .where(where);

    const data = await db
      .select()
      .from(apps)
      .where(where)
      .limit(pageSize)
      .offset(offset)
      .orderBy(apps.averageTrueScore);

    res.json({
      data,
      total: Number(count),
      page,
      pageSize,
      totalPages: Math.ceil(Number(count) / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/apps/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [app] = await db
      .select()
      .from(apps)
      .where(eq(apps.slug, req.params.slug))
      .limit(1);

    if (!app) throw createError('App not found', 404, 'NOT_FOUND');
    res.json(app);
  } catch (err) {
    next(err);
  }
});

// POST /api/apps
router.post('/', requireAuth, validate(submitAppSchema), async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const [app] = await db
      .insert(apps)
      .values({ name, slug, ...rest, submittedByUserId: req.user!.userId })
      .returning();

    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
});

export default router;
`);

write('apps/api/src/routes/reviews.ts', `import { Router } from 'express';
import { db } from '../db';
import { reviews, reviewVotes, apps, users } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { createReviewSchema } from '@trueapp/shared';
import { eq, and, sql } from 'drizzle-orm';

const router = Router();

// GET /api/reviews?appId=...
router.get('/', async (req, res, next) => {
  try {
    const appId = req.query.appId as string;
    if (!appId) throw createError('appId is required', 400, 'BAD_REQUEST');

    const page = Math.max(1, parseInt(String(req.query.page ?? '1')));
    const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize ?? '20'))));
    const offset = (page - 1) * pageSize;

    const [{ count }] = await db
      .select({ count: sql<number>\`count(*)\` })
      .from(reviews)
      .where(eq(reviews.appId, appId));

    const data = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        appId: reviews.appId,
        trueScore: reviews.trueScore,
        title: reviews.title,
        body: reviews.body,
        pros: reviews.pros,
        cons: reviews.cons,
        pricingClarity: reviews.pricingClarity,
        dataPrivacyRating: reviews.dataPrivacyRating,
        darkPatternRating: reviews.darkPatternRating,
        overallSatisfaction: reviews.overallSatisfaction,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        helpfulVotes: reviews.helpfulVotes,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.appId, appId))
      .limit(pageSize)
      .offset(offset)
      .orderBy(reviews.createdAt);

    res.json({
      data,
      total: Number(count),
      page,
      pageSize,
      totalPages: Math.ceil(Number(count) / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews
router.post('/', requireAuth, validate(createReviewSchema), async (req, res, next) => {
  try {
    const { appId, ...reviewData } = req.body;
    const userId = req.user!.userId;

    // Check app exists
    const [app] = await db.select({ id: apps.id }).from(apps).where(eq(apps.id, appId)).limit(1);
    if (!app) throw createError('App not found', 404, 'NOT_FOUND');

    // One review per user per app
    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.appId, appId)))
      .limit(1);
    if (existing) throw createError('You have already reviewed this app', 409, 'DUPLICATE_REVIEW');

    const [review] = await db
      .insert(reviews)
      .values({ userId, appId, ...reviewData })
      .returning();

    // Recompute averageTrueScore and totalReviews on the app
    const [stats] = await db
      .select({
        avg: sql<number>\`avg(true_score)\`,
        count: sql<number>\`count(*)\`,
      })
      .from(reviews)
      .where(eq(reviews.appId, appId));

    await db
      .update(apps)
      .set({
        averageTrueScore: String(Math.round(Number(stats.avg) * 100) / 100),
        totalReviews: Number(stats.count),
        updatedAt: new Date(),
      })
      .where(eq(apps.id, appId));

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews/:id/vote
router.post('/:id/vote', requireAuth, async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user!.userId;
    const { helpful } = req.body;

    if (typeof helpful !== 'boolean') {
      throw createError('"helpful" must be a boolean', 422, 'VALIDATION_ERROR');
    }

    // Upsert vote
    await db
      .insert(reviewVotes)
      .values({ reviewId, userId, helpful })
      .onConflictDoUpdate({
        target: [reviewVotes.userId, reviewVotes.reviewId],
        set: { helpful },
      });

    // Recompute helpful votes
    const [{ count }] = await db
      .select({ count: sql<number>\`count(*)\` })
      .from(reviewVotes)
      .where(and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.helpful, true)));

    await db
      .update(reviews)
      .set({ helpfulVotes: Number(count) })
      .where(eq(reviews.id, reviewId));

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
`);

write('apps/api/src/routes/users.ts', `import { Router } from 'express';
import { db } from '../db';
import { users, reviews, apps } from '../db/schema';
import { createError } from '../middleware/errorHandler';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// GET /api/users/:username
router.get('/:username', async (req, res, next) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        role: users.role,
        isPremium: users.isPremium,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, req.params.username))
      .limit(1);

    if (!user) throw createError('User not found', 404, 'NOT_FOUND');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:username/reviews
router.get('/:username/reviews', async (req, res, next) => {
  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, req.params.username))
      .limit(1);

    if (!user) throw createError('User not found', 404, 'NOT_FOUND');

    const page = Math.max(1, parseInt(String(req.query.page ?? '1')));
    const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize ?? '20'))));
    const offset = (page - 1) * pageSize;

    const [{ count }] = await db
      .select({ count: sql<number>\`count(*)\` })
      .from(reviews)
      .where(eq(reviews.userId, user.id));

    const data = await db
      .select({
        id: reviews.id,
        trueScore: reviews.trueScore,
        title: reviews.title,
        body: reviews.body,
        createdAt: reviews.createdAt,
        app: {
          id: apps.id,
          name: apps.name,
          slug: apps.slug,
          logoUrl: apps.logoUrl,
        },
      })
      .from(reviews)
      .innerJoin(apps, eq(reviews.appId, apps.id))
      .where(eq(reviews.userId, user.id))
      .limit(pageSize)
      .offset(offset)
      .orderBy(reviews.createdAt);

    res.json({
      data,
      total: Number(count),
      page,
      pageSize,
      totalPages: Math.ceil(Number(count) / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
`);

// ─── apps/web ─────────────────────────────────────────────────────────────────
write('apps/web/package.json', JSON.stringify({
  name: '@trueapp/web',
  version: '0.0.1',
  private: true,
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
    lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
    typecheck: 'tsc --noEmit',
  },
  dependencies: {
    '@trueapp/shared': 'workspace:*',
    '@trueapp/api-client': 'workspace:*',
    'react': '^18.3.1',
    'react-dom': '^18.3.1',
    'wouter': '^3.1.3',
    '@tanstack/react-query': '^5.37.1',
    'zod': '^3.23.0',
    'react-hook-form': '^7.51.4',
    '@hookform/resolvers': '^3.4.2',
    'lucide-react': '^0.383.0',
    'clsx': '^2.1.1',
    'tailwind-merge': '^2.3.0',
    'class-variance-authority': '^0.7.0',
    'zustand': '^4.5.2',
  },
  devDependencies: {
    '@types/react': '^18.3.3',
    '@types/react-dom': '^18.3.0',
    '@vitejs/plugin-react': '^4.3.0',
    'typescript': '^5.4.5',
    'vite': '^5.2.12',
    'tailwindcss': '^3.4.4',
    'postcss': '^8.4.38',
    'autoprefixer': '^10.4.19',
    '@tailwindcss/typography': '^0.5.13',
  },
}, null, 2));

write('apps/web/tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    target: 'ES2020',
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    moduleResolution: 'Bundler',
    jsx: 'react-jsx',
    noEmit: true,
  },
  include: ['src'],
}, null, 2));

write('apps/web/vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
`);

write('apps/web/tailwind.config.ts', `import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
`);

write('apps/web/postcss.config.js', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);

write('apps/web/index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TrueApp — Honest App Reviews</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

write('apps/web/src/main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
`);

write('apps/web/src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-white text-gray-900 font-sans antialiased;
  }
}
`);

write('apps/web/src/lib/api.ts', `import { createApiClient } from '@trueapp/api-client';

export const api = createApiClient({
  baseUrl: '',  // Vite proxy handles /api -> http://localhost:3001
  getToken: () => null, // web uses cookies
});
`);

write('apps/web/src/lib/utils.ts', `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
}

export function scoreBg(score: number): string {
  if (score >= 8) return 'bg-green-100 text-green-700';
  if (score >= 6) return 'bg-yellow-100 text-yellow-700';
  if (score >= 4) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}
`);

write('apps/web/src/store/auth.ts', `import { create } from 'zustand';
import type { User } from '@trueapp/shared';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (v: boolean) => void;
}

// Simple Zustand store — populated by useAuth hook on mount
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
`);

write('apps/web/src/hooks/useAuth.ts', `import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    setUser(data ?? null);
    setLoading(queryLoading);
  }, [data, queryLoading]);

  return { user, isLoading };
}
`);

write('apps/web/src/components/layout/Navbar.tsx', `import { Link, useLocation } from 'wouter';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { useQueryClient } from '@tanstack/react-query';

export function Navbar() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  async function handleLogout() {
    await api.auth.logout();
    qc.setQueryData(['auth', 'me'], null);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-600 hover:text-brand-700">
          <span className="text-2xl">✓</span>
          TrueApp
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/apps" className="hover:text-brand-600 transition-colors">Browse</Link>
          <Link href="/categories" className="hover:text-brand-600 transition-colors">Categories</Link>
          {user && (
            <Link href="/submit" className="hover:text-brand-600 transition-colors">Submit App</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href={'/profile/' + user.username} className="text-sm font-medium text-gray-700 hover:text-brand-600">
                @{user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
`);

write('apps/web/src/components/layout/Layout.tsx', `import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TrueApp · Honest reviews for real people
      </footer>
    </div>
  );
}
`);

write('apps/web/src/components/ui/TrueScoreBadge.tsx', `import { cn, formatScore, scoreBg } from '../../lib/utils';

interface TrueScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrueScoreBadge({ score, size = 'md', className }: TrueScoreBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded',
    md: 'text-sm px-2.5 py-1 rounded-md font-semibold',
    lg: 'text-2xl px-4 py-2 rounded-xl font-bold',
  };

  return (
    <span className={cn(scoreBg(score), sizeClasses[size], className)}>
      {formatScore(score)}
    </span>
  );
}
`);

write('apps/web/src/components/ui/AppCard.tsx', `import { Link } from 'wouter';
import type { App } from '@trueapp/shared';
import { TrueScoreBadge } from './TrueScoreBadge';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={'/apps/' + app.slug}>
      <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer">
        <div className="flex items-start gap-3">
          {app.logoUrl ? (
            <img src={app.logoUrl} alt={app.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{app.name[0]}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
                {app.name}
              </h3>
              <TrueScoreBadge score={Number(app.averageTrueScore)} size="sm" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{app.developerName}</p>
            <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{app.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>{app.totalReviews} review{app.totalReviews !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span className="capitalize">{app.platform}</span>
        </div>
      </div>
    </Link>
  );
}
`);

write('apps/web/src/pages/HomePage.tsx', `import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { api } from '../lib/api';
import { AppCard } from '../components/ui/AppCard';

export function HomePage() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['apps', 'featured'],
    queryFn: () => api.apps.featured(),
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <span>✓</span> Transparency-first app reviews
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Find apps you can <span className="text-brand-600">actually trust</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            TrueApp scores every app on pricing clarity, data privacy, and dark patterns —
            so you know exactly what you're getting.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/apps"
              className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors"
            >
              Browse Apps
            </Link>
            <Link
              href="/register"
              className="text-brand-700 font-semibold px-6 py-3 rounded-xl border border-brand-200 hover:bg-brand-50 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </section>

      {/* How TrueScore works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">How TrueScore works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: '💰',
                title: 'Pricing Clarity',
                desc: 'Is the app honest about what costs money? Are trials clearly labelled?',
              },
              {
                icon: '🔒',
                title: 'Data Privacy',
                desc: 'Does it collect only what it needs? Are permissions reasonable?',
              },
              {
                icon: '🚫',
                title: 'No Dark Patterns',
                desc: 'Free from manipulative UX tricks, guilt-trip cancellations, and hidden fees.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured apps */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Apps</h2>
            <Link href="/apps" className="text-brand-600 text-sm font-medium hover:text-brand-700">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse h-32" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((app) => <AppCard key={app.id} app={app} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No featured apps yet.</p>
              <Link href="/submit" className="mt-2 inline-block text-brand-600 hover:text-brand-700 text-sm">
                Submit the first one →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
`);

write('apps/web/src/pages/AuthPage.tsx', `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { registerSchema, loginSchema } from '@trueapp/shared';
import type { RegisterInput, LoginInput } from '@trueapp/shared';
import { cn } from '../lib/utils';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export function AuthPage({ mode }: AuthPageProps) {
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const isLogin = mode === 'login';

  const schema = isLogin ? loginSchema : registerSchema;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginInput | RegisterInput>({ resolver: zodResolver(schema) });

  async function onSubmit(data: LoginInput | RegisterInput) {
    try {
      const res = isLogin
        ? await api.auth.login(data as LoginInput)
        : await api.auth.register(data as RegisterInput);

      qc.setQueryData(['auth', 'me'], res.user);
      navigate('/');
    } catch (err: any) {
      setError('root', { message: err.message ?? 'Something went wrong' });
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <a
              href={isLogin ? '/register' : '/login'}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                {...register('username' as any)}
                placeholder="your_username"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500',
                  (errors as any).username ? 'border-red-300' : 'border-gray-300',
                )}
              />
              {(errors as any).username && (
                <p className="mt-1 text-xs text-red-600">{(errors as any).username.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500',
                errors.email ? 'border-red-300' : 'border-gray-300',
              )}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500',
                errors.password ? 'border-red-300' : 'border-gray-300',
              )}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
`);

write('apps/web/src/pages/AppsPage.tsx', `import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/api';
import { AppCard } from '../components/ui/AppCard';

export function AppsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['apps', { search, page }],
    queryFn: () => api.apps.list({ search: search || undefined, page, pageSize: 20 }),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Apps</h1>

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search apps…"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse h-32" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((app) => <AppCard key={app.id} app={app} />)}
          </div>
          {data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {data.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No apps found{search ? ' for "' + search + '"' : ''}.</p>
        </div>
      )}
    </div>
  );
}
`);

write('apps/web/src/App.tsx', `import { Switch, Route } from 'wouter';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AppsPage } from './pages/AppsPage';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/apps" component={AppsPage} />
        <Route path="/login">{() => <AuthPage mode="login" />}</Route>
        <Route path="/register">{() => <AuthPage mode="register" />}</Route>
        <Route>
          <div className="text-center py-24 text-gray-500">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p>Page not found</p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
`);

// ─── apps/mobile skeleton ─────────────────────────────────────────────────────
write('apps/mobile/package.json', JSON.stringify({
  name: '@trueapp/mobile',
  version: '0.0.1',
  private: true,
  main: 'expo-router/entry',
  scripts: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web',
  },
  dependencies: {
    '@trueapp/shared': 'workspace:*',
    '@trueapp/api-client': 'workspace:*',
    'expo': '~51.0.0',
    'expo-router': '~3.5.0',
    'expo-status-bar': '~1.12.0',
    'react': '18.2.0',
    'react-native': '0.74.2',
    'react-native-safe-area-context': '4.10.5',
    'react-native-screens': '3.31.1',
    '@react-navigation/bottom-tabs': '^6.5.20',
    '@tanstack/react-query': '^5.37.1',
    'zod': '^3.23.0',
    'expo-secure-store': '~13.0.2',
  },
  devDependencies: {
    '@babel/core': '^7.24.5',
    '@types/react': '~18.2.79',
    'typescript': '^5.4.5',
  },
}, null, 2));

write('apps/mobile/app.json', JSON.stringify({
  expo: {
    name: 'TrueApp',
    slug: 'trueapp',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'trueapp',
    userInterfaceStyle: 'automatic',
    splash: { resizeMode: 'contain', backgroundColor: '#ffffff' },
    ios: { supportsTablet: true, bundleIdentifier: 'com.dtlogiclabs.trueapp' },
    android: { adaptiveIcon: { backgroundColor: '#ffffff' }, package: 'com.dtlogiclabs.trueapp' },
    plugins: ['expo-router'],
  },
}, null, 2));

write('apps/mobile/tsconfig.json', JSON.stringify({
  extends: 'expo/tsconfig.base',
  compilerOptions: { strict: true },
  include: ['**/*.ts', '**/*.tsx', '.expo/types/**/*.d.ts', 'expo-env.d.ts'],
}, null, 2));

write('apps/mobile/app/_layout.tsx', `import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
`);

write('apps/mobile/app/(tabs)/_layout.tsx', `import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#0d9488' }}>
      <Tabs.Screen name="index" options={{ title: 'Discover' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
`);

write('apps/mobile/app/(tabs)/index.tsx', `import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DiscoverScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Discover</Text>
      <Text style={styles.sub}>Honest app reviews coming soon…</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: '700', margin: 20, color: '#111' },
  sub: { marginHorizontal: 20, color: '#666' },
});
`);

write('apps/mobile/app/(tabs)/search.tsx', `import { View, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 28, fontWeight: '700', color: '#111' },
});
`);

write('apps/mobile/app/(tabs)/profile.tsx', `import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 28, fontWeight: '700', color: '#111' },
});
`);

write('apps/mobile/lib/api.ts', `import { createApiClient } from '@trueapp/api-client';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'trueapp_token';

export const api = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001',
  getToken: () => SecureStore.getItem(TOKEN_KEY),
});

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
`);

// ─── Seed file ────────────────────────────────────────────────────────────────
write('apps/api/src/db/seed.ts', `import 'dotenv/config';
import { db } from './index';
import { categories, apps } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  const categoryData = [
    { name: 'Productivity', slug: 'productivity', iconName: 'zap' },
    { name: 'Social', slug: 'social', iconName: 'users' },
    { name: 'Finance', slug: 'finance', iconName: 'dollar-sign' },
    { name: 'Health & Fitness', slug: 'health-fitness', iconName: 'heart' },
    { name: 'Entertainment', slug: 'entertainment', iconName: 'play' },
    { name: 'Education', slug: 'education', iconName: 'book' },
    { name: 'Utilities', slug: 'utilities', iconName: 'settings' },
    { name: 'Travel', slug: 'travel', iconName: 'map-pin' },
  ];

  const inserted = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing()
    .returning();

  console.log(\`  ✓ \${inserted.length} categories seeded\`);
  console.log('✅ Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
`);

// Add db:seed script to api package.json
const apiPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/api/package.json'), 'utf8'));
apiPkg.scripts['db:seed'] = 'tsx src/db/seed.ts';
fs.writeFileSync(path.join(root, 'apps/api/package.json'), JSON.stringify(apiPkg, null, 2));
console.log('  ✏  apps/api/package.json (updated db:seed script)');

// ─── Install ──────────────────────────────────────────────────────────────────
console.log('\n📦 Installing dependencies...');
try {
  execSync('pnpm --version', { stdio: 'ignore' });
  execSync('pnpm install', { cwd: root, stdio: 'inherit' });
  console.log('\n✅ Done! Next steps:');
  console.log('  1. Copy .env.example to .env and fill in your DATABASE_URL + JWT_SECRET');
  console.log('  2. pnpm run db:push   — push schema to your database');
  console.log('  3. pnpm run db:seed   — seed categories');
  console.log('  4. pnpm dev           — start all apps');
} catch {
  console.warn('\n⚠  pnpm not found. Install pnpm: npm i -g pnpm');
  console.warn('   Then run: pnpm install');
}
