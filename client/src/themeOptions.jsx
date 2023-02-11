const dark1 = "#090909";
const dark2 = "#222222";
const dark3 = "#555555";

const light1 = "#fafafa";
const light2 = "#efefef";

export default {
    palette: {
        type: 'dark',
        primary: {
            main: "#E3BE1E",
            light: "#ebd161",
            dark: "#443909"
        },
        secondary: {
            main: "#2138a0",
            light: "#7987c6",
            dark: "#132160"
        },
        background: {
            default: dark1,
            paper: dark2,
            card: dark3
        },
        text: {
            primary: light1,
            secondary: light2
        },
        error: {
            main: "#e31e42",
            dark: "#440913"
        },
        warning: {
            main: "#e35c1e",
            dark: "#441b09"
        },
        info: {
            main: "#1e44e3",
            dark: "#091444"
        },
        success: {
            main: "#44e31e",
            dark: "#144409"
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                a {
                    cursor: pointer;
                    color: inherit;
                    text-decoration: none;
                }
            `,
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    display: "flex",
                    alignItems: "center"
                },
                h1: {
                    textTransform: "uppercase",
                    fontWeight: 600,
                    fontSize: 110,
                    color: dark1,
                    fontFamily: "'Palanquin Dark', sans-serif"
                },
                h2: {
                    textTransform: "uppercase",
                    fontSize: 35,
                    color: dark1,
                    fontFamily: "'Palanquin Dark', sans-serif"
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                root: {
                    cursor: "help"
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: "#fafafa"
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    "&.Mui-expanded": {
                        margin: 0   
                    }
                }
            }
        }
    }
}