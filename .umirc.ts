import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "list" },
    { path: "/my/courses/learning", component: "list" },
    { path: "/course_set/:id", component: "detail" },
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
