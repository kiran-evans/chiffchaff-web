const dark1 = "#090909";
const dark2 = "#222222";
const dark3 = "#555555";

const light1 = "#fafafa";
const light2 = "#efefef";

const accent1 = "#009933";
const accent2 = "#6c9b00";

export default {
    palette: {
        type: 'dark',
        primary: {
            main: accent1
        },
        secondary: {
            main: accent2
        },
        background: {
            default: dark1,
            paper: dark2,
            card: dark3
        },
        text: {
            primary: light1,
            secondary: light2
        }
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    cursor: "pointer"
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    display: "flex",
                    alignItems: "center"
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    border: `2px solid ${dark1}`
                }
            }
        }
    }
}