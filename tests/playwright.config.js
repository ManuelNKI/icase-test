import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './e2e', workers: 1, use: { baseURL: process.env.BASE_WEB_URL || 'http://localhost:5173', trace: 'retain-on-failure' } });
