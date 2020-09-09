module.exports = {
    env: {
        browser: true,
        es2020: true
    },
    extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['react'],
    rules: {
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'react/jsx-indent': 0,
        'react/jsx-one-expression-per-line': 0,
        'react/jsx-indent-props': 0
    }
};
