module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "globals": {
        "module": "readonly",
        "Game": "writable",
        "l": "readonly",
        "b64_to_utf8": "readonly",
        "utf8_to_b64": "readonly",
        "Beautify": "writable",
        "realAudio": "readonly",
        "JSColor": "readonly",
        "jscolor": "readonly",
        "BeautifyAll": "readonly",
        "CM": "writable",
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
    }
};
