/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // NEW PALETTE: From User Image
                navy: {
                    DEFAULT: '#10232A', // Palette Color 1
                    light: '#1c3039',
                },
                slate: {
                    DEFAULT: '#3D4D55', // Palette Color 2
                    light: '#53656e',
                },
                grey: {
                    DEFAULT: '#A79E9C', // Palette Color 3
                    light: '#bdbcba',
                },
                beige: {
                    DEFAULT: '#D3C3B9', // Palette Color 4
                    light: '#e9e1db',
                    dark: '#b0a095',
                },
                bronze: {
                    DEFAULT: '#B58863', // Palette Color 5
                    light: '#c7a385',
                    dark: '#967052',
                },
                black: {
                    DEFAULT: '#161616', // Palette Color 6
                    light: '#2a2a2a',
                },
                // Mappings for existing consistent usage
                brand: {
                    DEFAULT: '#B58863',
                    gold: '#B58863',
                    blue: '#10232A',
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            boxShadow: {
                'premium': '0 10px 30px -10px rgba(16, 35, 42, 0.15)',
                'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
