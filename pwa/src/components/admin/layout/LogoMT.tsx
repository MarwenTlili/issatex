import { useTheme } from "@mui/material";
import React, { SVGProps } from "react";

type LogoMTProps = SVGProps<SVGSVGElement>;

/**
 * A dynamic logo component.
 *
 * It accepts all standard SVG properties, which are spread onto the root `<svg>` element.
 *
 * @param {LogoMTProps} props - Standard SVG properties to be spread on the `<svg>` element.
 * @returns {JSX.Element} The rendered SVG logo component.
 *
 * @example
 * // Basic usage (will adapt to theme mode)
 * <LogoMT />
 *
 * @example
 * // Overriding size and adding a custom class
 * <LogoMT width={150} height={60} className="header-logo" />
 */
export const LogoMT = (props: LogoMTProps): JSX.Element => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Colors dynamic based on mode
  const bracketColor = isDark ? "#ffffff" : "#0f172a";
  const letterColor = isDark ? "#90caf9" : "#1976d2";

  const font = {
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: 700,
    fontSize: 20,
  };

  return (
    <svg
      id="logo"
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MT logo"
      width={120}
      height={50}
      overflow="visible"
      {...props}
    >
      {/* Opening bracket */}
      <text x="0" y="26" style={font} fill={bracketColor}>
        &lt;
      </text>
      {/* MT letters */}
      <text x="14" y="26" style={font} fill={letterColor}>
        MT
      </text>
      {/* Closing bracket with slash */}
      <text x="50" y="26" style={font} fill={bracketColor}>
        /&gt;
      </text>
    </svg>
  );
};
