import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Rethink Sans Variable', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
}