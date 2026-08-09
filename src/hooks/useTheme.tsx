import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("ecoshopper-theme");
    const prefersDark = stored === "dark";
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("ecoshopper-theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}
