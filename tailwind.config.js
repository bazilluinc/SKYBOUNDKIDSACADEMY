/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                cream: { 50: '#FDFCF0', 100: '#FAF9E6', 200: '#F5F2D0' },
                red: { 400: '#FF4444', 500: '#FF0000', 600: '#CC0000' },
                grey: { 800: '#333333', 900: '#1A1A1A' }
            },
            borderRadius: { card: '32px', button: '24px' },
            boxShadow: { soft: '0 4px 20px rgba(0,0,0,0.08)', washi: '0 8px 30px rgba(255,0,0,0.15)' },
            fontFamily: { sans: ['Pretendard', 'Noto Sans KR', 'sans-serif'] },
        },
    },
    plugins: [],
}
