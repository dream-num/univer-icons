module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '58',
                    ie: '10'
                },
                useBuiltIns: 'usage',
                corejs: 2,
            },
        ],
    ],
    plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-runtime'],
    sourceMaps: true,
    env: {
        production: {
            plugins: ['transform-react-remove-prop-types'],
        },
    },
    // sourceType: 'unambiguous'
};
{
    "menu": {
        "id": "file",
        "label": "File",
        "submenu": [
            {
                "label": "New",
                "accelerator": "CmdOrCtrl+N",
                "click": "createNew"
            },
            {
                "label": "Open",
                "accelerator": "CmdOrCtrl+O",
                "click": "openFile"
            },
            {
                "type": "separator"
            },
            {
                "label": "Save",
                "accelerator": "CmdOrCtrl+S",
                "click": "saveFile"
            }
        ]
    }
}

