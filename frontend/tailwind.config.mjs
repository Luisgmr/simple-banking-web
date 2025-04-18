import { fontFamily } from 'tailwindcss/defaultTheme'
export default {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Rethink Sans Variable"', ...fontFamily.sans],
            },
        },
    },
    plugins: [],
}