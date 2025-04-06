// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f8f8f8",
    50: "#f0f0f0",
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#4c4c4c",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  primary: {
    // blue
    100: "#d0d1d5",
    200: "#a1a4ab",
    300: "#727681",
    400: "#1F2A40",
    500: "#141b2d",
    600: "#101624",
    700: "#0c101b",
    800: "#080b12",
    900: "#040509",
  },
  secondary: {
    50: "#f0f0f0",
    100: "#d3ddf2",
    200: "#a7bbE5",
    300: "#7b99d7",
    400: "#4f77ca",
    500: "#2355bd",
    600: "#1c4497",
    700: "#153371",
    800: "#0e224c",
    900: "#071126",
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.grey[0],
              light: tokensDark.grey[0],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.grey[800],
              light: tokensDark.grey[1000],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[10],
              alt: tokensDark.grey[0],
            },
            text: {
              primary: tokensDark.grey[1000],
              secondary: tokensDark.grey[800],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.grey[0],
              light: tokensDark.grey[0],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.grey[800],
              light: tokensDark.grey[1000],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[10],
              alt: tokensDark.grey[0],
            },
            text: {
              primary: tokensDark.grey[1000],
              secondary: tokensDark.grey[800],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
