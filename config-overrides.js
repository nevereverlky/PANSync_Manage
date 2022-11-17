const {override, fixBabelImports, addLessLoader, adjustStyleLoaders } = require('customize-cra');
const { getThemeVariables } = require('antd/dist/theme');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        // lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
            modifyVars: getThemeVariables({
                dark: true, // 开启暗黑模式
                compact: true, // 开启紧凑模式
            }),
            javascriptEnabled: true,
        // },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
        const postcssOptions = postcss.options;
        postcss.options = { postcssOptions };
    })
);