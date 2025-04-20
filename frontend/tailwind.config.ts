
export default {
    content: [
        './src/**/*.{ts,tsx}',
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend : {
            boxShadow: {
                custom: '0px 0px 8px 2px rgba(0,0,0,0.05)'
            },
        }
    },
    plugins: [],
}