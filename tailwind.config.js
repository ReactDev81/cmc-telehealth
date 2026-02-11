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
                    300: '#DCDCDC',
                    200: '#EDEDED'
                },
                grey:{
                    DEFAULT: '#939393',
                },
                gray:{
                    DEFAULT: '#929292',
                    300: '#D0D5DD'
                },
                success:{
                    DEFAULT: '#1ABE17',
                    400: '#E8F9E8'
                },
                warning:{
                    DEFAULT: '#EAB300',
                    400: '#FEF8EA'
                },
                danger:{
                    DEFAULT: '#FF0000',
                    400: '#FDE9ED'
                },
                info:{
                    DEFAULT: '#48A3D7',
                    400: '#EDF6FB'
                }
            },
            boxShadow: {
                custom: "0px 0px 4px 0px #00000029",
            },
        },
    },
    plugins: [],
}