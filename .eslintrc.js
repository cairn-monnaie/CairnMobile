module.exports = {
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "typescript-eslint-parser"
    },
    plugins: ["vue"], // enable vue plugin
    extends: ["plugin:vue/essential", "@vue/prettier"], // activate vue related rules,
    rules: {
        "vue/html-indent": ["error", 4],
        "no-unused-vars": 0,
        "vue/max-attributes-per-line": 0,
        "vue/no-parsing-error": [
            2,
            {
                "x-invalid-end-tag": false
            }
        ]
        // "prettier/prettier": "error"
    }
}
