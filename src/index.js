import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

document.addEventListener('DOMContentLoaded', function() {
  const themeStitcher = document.getElementById('themingSwitcher');
  const isSystemThemeSetToDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // set toggler position based on system theme
  const toggleTheme = (isChecked) => {
    const theme = isChecked ? "dark" : "light";

    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-bs-theme', theme);
  };

  if (isSystemThemeSetToDark) {
    themeStitcher.checked = true;
    toggleTheme(themeStitcher.checked);
  }

  // add listener to theme toggler
  themeStitcher.addEventListener("change", (e) => {
    toggleTheme(e.target.checked);
  });

  // add listener to toggle theme with Shift + D
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key === "D") {
      themeStitcher.checked = !themeStitcher.checked;
      toggleTheme(themeStitcher.checked);
    }
  });
});
