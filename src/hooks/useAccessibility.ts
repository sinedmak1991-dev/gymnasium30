import { useCallback, useEffect, useState } from 'react';

export type A11yFontSize = '100' | '115' | '130';
export type A11yColorScheme = 'default' | 'light-contrast' | 'dark-contrast';
export type A11yImagesMode = 'show' | 'grayscale' | 'hide';

export interface AccessibilitySettings {
  fontSize: A11yFontSize;
  colorScheme: A11yColorScheme;
  imagesMode: A11yImagesMode;
}

const STORAGE_KEY = 'gymnasium30_a11y_settings';

export const DEFAULT_A11Y_SETTINGS: AccessibilitySettings = {
  fontSize: '100',
  colorScheme: 'default',
  imagesMode: 'show',
};

function loadSavedSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_A11Y_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;

    const fontSize: A11yFontSize =
      parsed.fontSize === '115' || parsed.fontSize === '130' ? parsed.fontSize : '100';
    const colorScheme: A11yColorScheme =
      parsed.colorScheme === 'light-contrast' || parsed.colorScheme === 'dark-contrast'
        ? parsed.colorScheme
        : 'default';
    const imagesMode: A11yImagesMode =
      parsed.imagesMode === 'grayscale' || parsed.imagesMode === 'hide'
        ? parsed.imagesMode
        : 'show';

    return { fontSize, colorScheme, imagesMode };
  } catch {
    return DEFAULT_A11Y_SETTINGS;
  }
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSavedSettings);

  useEffect(() => {
    const root = document.documentElement;

    // Розмір шрифту на кореневому елементі
    root.style.fontSize = settings.fontSize === '100' ? '' : `${settings.fontSize}%`;
    if (settings.fontSize === '100') {
      root.removeAttribute('data-a11y-font');
    } else {
      root.setAttribute('data-a11y-font', settings.fontSize);
    }

    // Колірна схема
    root.classList.remove('a11y-light-contrast', 'a11y-dark-contrast');
    if (settings.colorScheme === 'light-contrast') {
      root.classList.add('a11y-light-contrast');
    } else if (settings.colorScheme === 'dark-contrast') {
      root.classList.add('a11y-dark-contrast');
    }

    // Режим зображень
    root.classList.remove('a11y-images-grayscale', 'a11y-images-hide');
    if (settings.imagesMode === 'grayscale') {
      root.classList.add('a11y-images-grayscale');
    } else if (settings.imagesMode === 'hide') {
      root.classList.add('a11y-images-hide');
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ігноруємо помилки доступу до localStorage в приватному режимі
    }
  }, [settings]);

  const setFontSize = useCallback((fontSize: A11yFontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  }, []);

  const setColorScheme = useCallback((colorScheme: A11yColorScheme) => {
    setSettings((prev) => ({ ...prev, colorScheme }));
  }, []);

  const setImagesMode = useCallback((imagesMode: A11yImagesMode) => {
    setSettings((prev) => ({ ...prev, imagesMode }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_A11Y_SETTINGS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ігноруємо помилки доступу до localStorage
    }
  }, []);

  const isCustomActive =
    settings.fontSize !== '100' ||
    settings.colorScheme !== 'default' ||
    settings.imagesMode !== 'show';

  return {
    settings,
    isCustomActive,
    setFontSize,
    setColorScheme,
    setImagesMode,
    resetSettings,
  };
}
