import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  nextPlugin.configs["core-web-vitals"],
];
