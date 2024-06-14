module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    // 禁用未使用值的错误提示
    'no-unused-vars': 'off', // 或者使用 'warn' 作为警告级别
    "@typescript-eslint/no-unused-vars": "warn"
  },
};
