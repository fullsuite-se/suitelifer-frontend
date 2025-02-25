import React from "react";

const IconLogout = ({ color, height, width }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xlinkHref="http://www.w3.org/1999/xlink"
    >
      <mask
        id="mask0_462_2254"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="22"
        height="22"
      >
        <rect width="22" height="22" fill="url(#pattern0_462_2254)" />
      </mask>
      <g mask="url(#mask0_462_2254)">
        <rect width="90" height="90" fill={`${color}`} />
      </g>
      <defs>
        <pattern
          id="pattern0_462_2254"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_462_2254" transform="scale(0.0111111)" />
        </pattern>
        <image
          id="image0_462_2254"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE20lEQVR4nO2c36tVRRTHlz/Se8seKpQwo+ixNIjKX3WDkDB76iehllTWQ78z7T9IrKwkLNCnQvApkiy416z7GoWV1mtUlKZQar+0W2F+YjwruBz2nr23+5y99syZz9N5OrPme+bMrFlrzRJJJBKJRCKRSCQSiUQ5gGnAtcBa4EXgXeAr4BvgOPA38K9+PgLsB3YDW4AHgauB6SWHGyyAS4CnVLBfqc9vwDvAI8AcGWSAIWA18AFwiv7xD/A+cJf7t8igAMwC1gOHaR63/TwBDEusANOBdcBR7PkeWANMlZgAbgS+pH18CsyX0AFmAK8BpysK8AcwBmzUlbcIuAK4QL9zqn6eCywFVgIvAB8CJyqO5byY5yRUVJh9FSb8I7BZhTtr9wyYCSwDXq+4Ta2R0ABuBn4pOcG9wPJ+eAS6+u8FPithx7iEBHAn8FeJiY0B1zdo160F50Q4QuvNrMgn/gG4w8g+t7c/qheabu6XgFZykcg7nB/dAlsvBd7SPdz51o9JQHvyhEfgP91qt7YzaNS78B18x4EbrO0MGj3V9xW4bPOt7QwevYz4VnISuUfX6tOePTltFz0KEB3wrOYHag+SOCO0i8LlsSNp1Lt48lFP+NHcT44CYINnNZvc+GJNP+VlRsYkYIBhYLuGWX8GXnKRQCtjXI4vj4USMHRE7mbURGxNpGaxVwIGmKLJBszF1pKAvKDRcgkc4HfPv7U5sYGnPdfs4NP4dApwMBdbi1uy2CwRQCcFNmoqtpZp5UXolkokYC02cF3OoO4AOUciAkuxgYdi9J1bJ7Y671k8L3HH2t8rEHuPu8Q1cRCGkdAMRWxPmn6RRA5NbiPAdzkDXN6T2eQAnAu80aOa6X4zWntle8KiF9X64gKAbYTF9roTdoWAWcyo9cXFxS4uJRYSJ2uVAiehmxM6bR3l2HbWIhsfhsPA1gqVqZaM9eIwzHPvFkvkUM69qy+yDube+sVRvN3yC4t7WJnFRokUjK7geUGlPTLYt8GhXg/sngxnMchh0qGmA//R1NhhKXKJA/FliQDaILIa8mTO4IcjSc5uNRdZDZnrKTdYIQFDJ65y0lzkSQY5dyaLjyR8oSc8IjdbrQSs8vzqQd8SgTdbIfKkIkdXMBNjWdgsFXtC3dYtZkWOatCznlV9twQOMEXaAHCelrVmcRA439rGaPDU4Tl2WtsXDXpTdN258lhrbWM0AEsKnr+NWNsYDcCrnlXtYiMLrG2MKWbr+hLhuZ4vsLYzClzeUJ8j+1b2iLWdUQDcVNBGYsJ1VbS2MwqA20s0RtnZBj+7qzHKty4yKSHh3oCXEPsgcI+hWxp2q5+ule3bRv7H9ahb0qBdK7Rrb/jNq7r2bN8BOZlx4LY+tWObqRHHzykmPKEdwGXAJ5TniPrlI3WKJ1XcW7Tc91iF8e+TUHEZcuAVbaxdhRP6SneTtnhbrL2bLlTffZq2zJynDVpW6/OP8YJMSRauR98GiQE6Qn1B+/gYuFJigs4qdAnen6zV1aLNVa2JPffxucQzwCEDgb9W984uc9I0dA6tlZqX63fr+d3qdsbVmLsqwMXA48Cuip6CL77yNvAwMNt6fm1O/V+j3sYmFX+/9hA9pu9pTqmffkh95F3q3bim3lfFUNCTSCQSiUQikUgkEtIU/wEz25tKrkxP0wAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
};

export default IconLogout;
