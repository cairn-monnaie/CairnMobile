module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'typescript-eslint-parser'
    },
    plugins: ['vue'], // enable vue plugin
    extends: ['plugin:vue/essential', 'prettier'], // activate vue related rules,
    rules: {
        'vue/no-parsing-error': [2, {

            "x-invalid-end-tag": false
          }]
    }
};
