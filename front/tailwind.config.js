/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard_regular: ['Pretendard-Regular'],
        pretendard_semibold: ['Pretendard-SemiBold'],
        pretendard_exlight: ['Pretendard-ExtraLight'],
        partial_sans: ['PartialSansKR-Regular'],
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
        poster_list: '939953 / 1012453',
      },
    },
  },
  plugins: [],
};
