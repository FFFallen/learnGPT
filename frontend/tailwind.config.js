/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 支持类名切换深色模式
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 扫描src文件夹下所有JS/JSX文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}