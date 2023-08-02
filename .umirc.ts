import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/detail", component: "detail" },
    { path: "/list", component: "list" },
    { path: "/my/courses/learning", component: "list" },
    { path: "/course_set/:id", component: "course_set" },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:3000/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
});
