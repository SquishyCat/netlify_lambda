module.exports = {
    "env": {
        "browser": true
    },
    "plugins": [node],
    "extends": ["eslint:recommended", "plugin:node/recommended"],
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "node/exports-style": ["error", "module.exports"]
    },
    "globals": {
        "Phaser": true,
        "THREE": true
    }
};