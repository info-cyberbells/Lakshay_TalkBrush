/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#ffd760',
                secondary: '#FAB713',
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                nunito: ['Nunito', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            keyframes: {
                fadeSlideIn: {
                    from: {
                        opacity: '0',
                        transform: 'translateY(-10px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
            animation: {
                fadeSlideIn: 'fadeSlideIn 0.4s ease',
            },
        },
    },
    plugins: [],
}