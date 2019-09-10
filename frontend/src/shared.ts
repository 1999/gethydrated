import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components';

// thanks to http://colormind.io/bootstrap/
export enum PALETTE {
  BLACK = '#172b4d',
  WHITE = '#f7f6f7',
  GREEN = '#86b95e',
  LIGHTBLUE = '#b0d1ea',
  MARINE = '#05afc7',
  FACEBOOK = '#2E96E6',
  PLACEHOLDER = '#97a0af',
  RED = '#f2510e',
}

export const globalStyle = css`
  color: ${PALETTE.BLACK};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  -webkit-font-smoothing: antialiased;
`;

export const formElementStyle = css`
  ${globalStyle};

  width: 100%;
  outline: none;
  padding: 0;
  margin: 0;
  border: none;

  &::placeholder {
    color: ${PALETTE.PLACEHOLDER};
  }
`;

export const textOverflowEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FillArea = styled.div`
  color: ${PALETTE.PLACEHOLDER};
  font-weight: 500;
  line-height: 120px;
  text-align: center;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CssInterpolation = FlattenInterpolation<ThemeProps<any>>;

const forSize = (size: 'desktop' | 'mobile', style: CssInterpolation) => {
  const mediaQuery = size === 'desktop' ? 'min-width: 1025px' : 'max-width: 1024px';

  return css`
    @media only screen and (${mediaQuery}) {
      ${style}
    }
  `;
}

export const desktop = (style: CssInterpolation) => forSize('desktop', style);
export const mobile = (style: CssInterpolation) => forSize('mobile', style);

export const retina = (style: CssInterpolation) => css`
  @media
    only screen and (-webkit-min-device-pixel-ratio: 2),
    only screen and (min--moz-device-pixel-ratio: 2),
    only screen and (min-device-pixel-ratio: 2) {
      ${style};
    }
`;

export const rowItem = css`
  padding: 8px 16px;
  line-height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid #e2e2e2;

  ${retina(css`
    border-bottom: 0.5px solid #e2e2e2;
  `)};
`;

export const GlobalContainer = styled.div`
  ${globalStyle};
`;
