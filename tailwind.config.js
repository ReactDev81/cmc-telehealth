/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,tsx}", 
        "./components/**/*.{js,jsx,ts,tsx}",
        
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary:{
                    DEFAULT: '#013220',
                    400: '#344054',
                    200: '#E5EAE8',
                    100: '#F5F7F6'
                },
                black:{
                    DEFAULT: '#1F1E1E',
                    400: '#4D4D4D',
                    300: '#DCDCDC'
                },
                grey:{
                    DEFAULT: '#939393',
                },
                gray:{
                    DEFAULT: '#929292',
                    300: '#D0D5DD'
                }
            },
            boxShadow: {
                custom: "0px 0px 4px 0px #00000029",
            },
        },
    },
    plugins: [],
}