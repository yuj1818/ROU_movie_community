/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard_regular: ['Pretendard-Regular'],
        pretendard_semibold: ['Pretendard-SemiBold'],
        pretendard_exlight: ['Pretendard-ExtraLight'],
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};
