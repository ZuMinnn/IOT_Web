import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('iot_settings');
    return saved ? JSON.parse(saved) : { ldrType: '3pin' }; // default 3pin
  });

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('iot_settings', JSON.stringify(updated));
    window.dispatchEvent(new Event('settings_changed'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('iot_settings');
      if (saved) setSettings(JSON.parse(saved));
    };
    window.addEventListener('settings_changed', handleStorageChange);
    return () => window.removeEventListener('settings_changed', handleStorageChange);
  }, []);

  return { settings, updateSettings };
};
