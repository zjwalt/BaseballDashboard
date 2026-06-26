import { createTheme } from '@mui/material/styles';


export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#12091f',
      paper: '#1e1130',
    },
    primary: {
      main: '#b39ddb',
      light: '#d1c4e9',
      dark: '#7e57c2',
    },
    text: {
      primary: '#ede7f6',
      secondary: '#9e8fb5',
      disabled: '#5c4f970',
    },
    divider: '#2e1f4a',
    action: {
      hover: 'rgba(179, 157, 219, 0.08)',
      selected: 'rgba(179, 157, 219, 0.14)',
    },
  },

  typography: {
    fontFamily: "JetBrains Mono, 'DM Sans', sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.03em', color: '#ede7f6' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', color: '#ede7f6'},
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    body1: { fontSize: 14 },
    body2: { fontSize: 12, color: '#9e8fb5'},
    caption: {
      fontSize: 10,
      textTransform: "uppercase" as const,
      letterSpacing: '0.1em',
      color: '#5c4f70'
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#12091f',
          scrollbarColor: '#2e1f4a #12091f',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#12091f' },
          '&::-webkit-scrollbar-thumb': {
            background: '#2e1f4a',
            borderRadius: 3
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1c1130',
          border: '1px solid #2e1f4a',
          transition: 'border-color 0.2s, transform 0.2s',
          '&:hover': {
            borderColor: '#7e57c2',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 14,
          color: '#5c4f70',
          '&.Mui-selected': {
            color: '#b39ddb',
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#b39ddb',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#2e1f4a',
          color: '#b39ddb',
          fontFamily:"'DM Mono', monospace",
          fontSize: 11,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#7e57c2',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#2e1f4a',
          color: '#ede7f6',
        },
        head: {
          color: '#5c4f70',
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2e1f4a',
          color: '#ede7f6',
          fontSize: 12,
          border: '1px solid #3d2960',
        },
      },
    },
  },
});

export const colors = {
  // Backgrounds
  bgBase: '#12091f',
  bgSurface: '#1c1130',
  bgElevated: '#251640',

  // Purple Scale
  purple100: '#ede7f6',
  purple200: '#d1c4e9',
  puprle300: '#b39ddb',
  purple400: '#9575cd',
  purple500: '#7e57c2',
  purple600: '#4a2d80',
  purple700: '#2e1f4a',
  purple800: '#1c1130',
  purple900: '#12091f',

  // Percentile scale
  percentile: {
    elite: '#e05c2e',     // x >= 90
    great: '#e8932a',     // 70 <= x < 90
    aboveAvg: '#d4b84a',  // 50 <= x < 70
    belowAvg: '#7ab468',  // 30 <= x < 50
    poor: '#4a9fd4',      // 0 <= x < 30
  },
};
