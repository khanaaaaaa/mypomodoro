/// <reference types="chrome" />
import React, { useState, useEffect } from 'react';

export interface CustomTheme {
  id: string;
  name: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  mood: string;
  createdAt: number;
}

export const DEFAULT_CUSTOM_THEMES: CustomTheme[] = [];

interface CustomThemeCreatorProps {
  onThemeCreated: (theme: CustomTheme) => void;
  onApplyTheme: (theme: CustomTheme) => void;
}

export const CustomThemeCreator: React.FC<CustomThemeCreatorProps> = ({
  onThemeCreated,
  onApplyTheme,
}) => {
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '🎨',
    primaryColor: '#d4af37',
    secondaryColor: '#f0d860',
    fontFamily: 'serif',
    mood: 'mysterious',
  });

  useEffect(() => {
    chrome.storage.local.get(['customThemes'], (data: any) => {
      if (data.customThemes) {
        setCustomThemes(data.customThemes as CustomTheme[]);
      }
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTheme = () => {
    if (!formData.name.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const newTheme: CustomTheme = {
      id: `custom_${Date.now()}`,
      ...formData,
      createdAt: Date.now(),
    };

    const updated = [...customThemes, newTheme];
    setCustomThemes(updated);
    chrome.storage.local.set({ customThemes: updated });

    // Reset form
    setFormData({
      name: '',
      icon: '🎨',
      primaryColor: '#d4af37',
      secondaryColor: '#f0d860',
      fontFamily: 'serif',
      mood: 'mysterious',
    });
    setShowCreator(false);

    onThemeCreated(newTheme);
  };

  const handleDeleteTheme = (id: string) => {
    const updated = customThemes.filter((t) => t.id !== id);
    setCustomThemes(updated);
    chrome.storage.local.set({ customThemes: updated });
  };

  return (
    <div className="custom-theme-section">
      <h2>🎨 Custom Themes</h2>

      {!showCreator ? (
        <button
          className="create-theme-btn"
          onClick={() => setShowCreator(true)}
        >
          ✨ Create New Theme
        </button>
      ) : (
        <div className="theme-creator-form">
          <h3>Design Your Theme</h3>

          <div className="form-group">
            <label>Theme Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Neon Sunset"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Theme Icon</label>
            <input
              type="text"
              name="icon"
              placeholder="e.g., 🌅"
              maxLength={2}
              value={formData.icon}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Secondary Color</label>
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Font Style</label>
            <select
              name="fontFamily"
              value={formData.fontFamily}
              onChange={handleInputChange}
            >
              <option value="serif">Elegant (Serif)</option>
              <option value="monospace">Futuristic (Monospace)</option>
              <option value="sans-serif">Modern (Sans-serif)</option>
              <option value="cursive">Artistic (Cursive)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mood Tag</label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleInputChange}
            >
              <option value="adventurous">⚔️ Adventurous</option>
              <option value="nostalgic">🕰️ Nostalgic</option>
              <option value="mysterious">🔮 Mysterious</option>
              <option value="energetic">⚡ Energetic</option>
            </select>
          </div>

          <div className="theme-preview">
            <h4>Preview:</h4>
            <div
              className="preview-box"
              style={{
                background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`,
                fontFamily: formData.fontFamily,
              }}
            >
              <span style={{ fontSize: '20px' }}>{formData.icon}</span>
              <span>{formData.name || 'Your Theme'}</span>
            </div>
          </div>

          <div className="form-buttons">
            <button
              className="btn-primary"
              onClick={handleCreateTheme}
            >
              ✨ Create Theme
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowCreator(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {customThemes.length > 0 && (
        <div className="custom-themes-list">
          <h3>Your Custom Themes</h3>
          <div className="themes-grid">
            {customThemes.map((theme) => (
              <div
                key={theme.id}
                className="custom-theme-card"
                onClick={() => onApplyTheme(theme)}
              >
                <div
                  className="theme-card-preview"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  }}
                >
                  {theme.icon}
                </div>
                <div className="theme-card-info">
                  <div className="theme-card-name">{theme.name}</div>
                  <div className="theme-card-mood">{theme.mood}</div>
                  <button
                    className="theme-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this theme?')) {
                        handleDeleteTheme(theme.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {customThemes.length === 0 && !showCreator && (
        <div className="empty-state">
          <p>No custom themes yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};
