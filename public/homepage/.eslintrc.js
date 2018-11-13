module.exports = {
  extends: [
    'airbnb-base'
  ],
  rules: {
    "func-names": ["error", "as-needed"],
    "linebreak-style": ["error", "windows"],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "no-console":  ["error", { allow: ["log", "info", "warn", "error"] }],
    'no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^internals$', args: 'none' }],
  }
};
