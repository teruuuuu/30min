/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
      // 既存のタグ関連クラス
      'bg-blue-300', 'text-blue-800', 'dark:bg-blue-900', 'dark:text-blue-300',
      'bg-pink-300', 'text-pink-800', 'dark:bg-pink-900', 'dark:text-pink-300',
      'bg-yellow-300', 'text-yellow-800', 'dark:bg-yellow-900', 'dark:text-yellow-300',
      'bg-green-300', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-300',
      'bg-red-300', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-300',
      'bg-orange-300', 'text-orange-800', 'dark:bg-orange-900', 'dark:text-orange-300',
      'bg-gray-300', 'text-gray-800', 'dark:bg-gray-900', 'dark:text-gray-300',

      // 新しいタグのスタイルで使用されるクラス
      // 背景色（半透明）
      'bg-purple-500/20',
      'bg-pink-500/20',
      'bg-emerald-500/20', // nature に使用される新しい色
      'bg-cyan-500/20',
      'bg-red-500/20',
      'bg-orange-500/20',
      'bg-white/10', // デフォルトで使用される色

      // テキスト色
      'text-purple-300',
      'text-pink-300',
      'text-emerald-300', // nature に使用される新しい色
      'text-cyan-300',
      'text-red-300',
      'text-orange-300',
      'text-white/80', // デフォルトで使用される色

      // 枠線
      'border', // border 自体も追加
      'border-purple-500/50',
      'border-pink-500/50',
      'border-emerald-500/50', // nature に使用される新しい色
      'border-cyan-500/50',
      'border-red-500/50',
      'border-orange-500/50',
      'border-white/20', // デフォルトで使用される色

      // 共通のユーティリティクラス
      'text-xs', 'me-2', 'px-2.5', 'py-0.5', 'rounded-full', 'backdrop-blur-sm',
      'text-gray-500', // 既存
      'rounded' // 既存でroundedも使われている可能性を考慮
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ]
}