import React, { useState, useEffect } from 'react';
import './EmbedIframeDialog.css';

interface EmbedIframeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEmbed: (data: {
    src: string;
    width: string;
    height: string;
    aspectRatio: string;
    name?: string;
    title?: string;
    longDescription?: string;
    descriptionUrl?: string;
    showBorder: boolean;
    enableScrollbar: boolean;
  }) => void;
  initialData?: {
    src?: string;
    width?: string;
    height?: string;
    aspectRatio?: string;
    name?: string;
    title?: string;
    longDescription?: string;
    descriptionUrl?: string;
    showBorder?: boolean;
    enableScrollbar?: boolean;
  };
}

const SIZE_OPTIONS = [
  { label: 'Inline Value', value: 'inline' },
  { label: 'Responsive - 21x9', value: '21x9' },
  { label: 'Responsive - 16x9', value: '16x9' },
  { label: 'Responsive - 4x3', value: '4x3' },
  { label: 'Responsive - 1x1', value: '1x1' },
];

export const EmbedIframeDialog: React.FC<EmbedIframeDialogProps> = ({
  isOpen,
  onClose,
  onEmbed,
  initialData
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');

  // General tab fields
  const [src, setSrc] = useState(initialData?.src || '');
  const [selectedSize, setSelectedSize] = useState(initialData?.aspectRatio || 'inline');
  const [width, setWidth] = useState(initialData?.width || '100%');
  const [height, setHeight] = useState(initialData?.height || '400px');
  const [constrainProportions, setConstrainProportions] = useState(true);

  // Advanced tab fields
  const [name, setName] = useState(initialData?.name || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [longDescription, setLongDescription] = useState(initialData?.longDescription || '');
  const [descriptionUrl, setDescriptionUrl] = useState(initialData?.descriptionUrl || '');
  const [showBorder, setShowBorder] = useState(initialData?.showBorder ?? true);
  const [enableScrollbar, setEnableScrollbar] = useState(initialData?.enableScrollbar ?? true);

  useEffect(() => {
    if (initialData) {
      setSrc(initialData.src || '');
      setSelectedSize(initialData.aspectRatio || 'inline');
      setWidth(initialData.width || '100%');
      setHeight(initialData.height || '400px');
      setName(initialData.name || '');
      setTitle(initialData.title || '');
      setLongDescription(initialData.longDescription || '');
      setDescriptionUrl(initialData.descriptionUrl || '');
      setShowBorder(initialData.showBorder ?? true);
      setEnableScrollbar(initialData.enableScrollbar ?? true);
    }
  }, [initialData]);

  const handleSizeChange = (sizeValue: string) => {
    setSelectedSize(sizeValue);

    if (sizeValue === 'inline') {
      setWidth('100%');
      setHeight('400px');
    } else {
      // For responsive presets, set width to 100% and height to auto
      setWidth('100%');
      setHeight('auto');
    }
  };

  const handleWidthChange = (newWidth: string) => {
    setWidth(newWidth);
    if (constrainProportions && selectedSize === 'inline') {
      // Calculate height based on 16:9 aspect ratio (you can adjust this)
      const widthValue = parseFloat(newWidth);
      if (!isNaN(widthValue)) {
        const heightValue = (widthValue * 9) / 16;
        setHeight(`${heightValue}px`);
      }
    }
  };

  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);
    if (constrainProportions && selectedSize === 'inline') {
      // Calculate width based on 16:9 aspect ratio
      const heightValue = parseFloat(newHeight);
      if (!isNaN(heightValue)) {
        const widthValue = (heightValue * 16) / 9;
        setWidth(`${widthValue}px`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!src.trim()) {
      alert('Please enter a source URL');
      return;
    }

    let finalWidth = width;
    let finalHeight = height;

    // Apply aspect ratio classes for responsive embeds
    if (selectedSize !== 'inline') {
      finalWidth = '100%';
      finalHeight = 'auto';
    }

    onEmbed({
      src: src.trim(),
      width: finalWidth,
      height: finalHeight,
      aspectRatio: selectedSize,
      name: name.trim() || undefined,
      title: title.trim() || undefined,
      longDescription: longDescription.trim() || undefined,
      descriptionUrl: descriptionUrl.trim() || undefined,
      showBorder,
      enableScrollbar
    });

    onClose();
  };

  const handleCancel = () => {
    // Reset to initial data
    setSrc(initialData?.src || '');
    setSelectedSize(initialData?.aspectRatio || 'inline');
    setWidth(initialData?.width || '100%');
    setHeight(initialData?.height || '400px');
    setName(initialData?.name || '');
    setTitle(initialData?.title || '');
    setLongDescription(initialData?.longDescription || '');
    setDescriptionUrl(initialData?.descriptionUrl || '');
    setShowBorder(initialData?.showBorder ?? true);
    setEnableScrollbar(initialData?.enableScrollbar ?? true);
    setActiveTab('general');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div className="rte-dialog-content embed-iframe-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rte-dialog-header">
          <h3>Embed Iframe</h3>
          <button className="rte-dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="rte-dialog-body">
          {/* Vertical Tabs */}
          <div className="rte-vertical-tabs">
            <div className="rte-tab-buttons">
              <button
                className={`rte-tab-button ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General
              </button>
              <button
                className={`rte-tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveTab('advanced')}
              >
                Advanced
              </button>
            </div>

            <div className="rte-tab-content">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="rte-tab-panel">
                  {/* Source URL */}
                  <div className="rte-form-group">
                    <label className="rte-form-label">Source</label>
                    <input
                      type="url"
                      className="rte-form-input"
                      placeholder="https://example.com"
                      value={src}
                      onChange={(e) => setSrc(e.target.value)}
                      required
                    />
                  </div>

                  {/* Size Dropdown */}
                  <div className="rte-form-group">
                    <label className="rte-form-label">Size</label>
                    <select
                      className="rte-form-select"
                      value={selectedSize}
                      onChange={(e) => handleSizeChange(e.target.value)}
                    >
                      {SIZE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Width and Height (only for Inline Value) */}
                  {selectedSize === 'inline' && (
                    <div className="rte-form-row">
                      <div className="rte-form-group">
                        <label className="rte-form-label">Width</label>
                        <input
                          type="text"
                          className="rte-form-input"
                          placeholder="100%"
                          value={width}
                          onChange={(e) => handleWidthChange(e.target.value)}
                        />
                      </div>
                      <div className="rte-form-group">
                        <label className="rte-form-label">Height</label>
                        <input
                          type="text"
                          className="rte-form-input"
                          placeholder="400px"
                          value={height}
                          onChange={(e) => handleHeightChange(e.target.value)}
                        />
                      </div>
                      <div className="rte-form-group constrain-group">
                        <button
                          type="button"
                          className={`rte-constrain-btn ${constrainProportions ? 'locked' : 'unlocked'}`}
                          onClick={() => setConstrainProportions(!constrainProportions)}
                          title={constrainProportions ? 'Unlock proportions' : 'Lock proportions'}
                        >
                          {constrainProportions ? '🔒' : '🔓'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="rte-tab-panel">
                  <div className="rte-form-group">
                    <label className="rte-form-label">Name</label>
                    <input
                      type="text"
                      className="rte-form-input"
                      placeholder="Iframe name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="rte-form-group">
                    <label className="rte-form-label">Title</label>
                    <input
                      type="text"
                      className="rte-form-input"
                      placeholder="Iframe title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="rte-form-group">
                    <label className="rte-form-label">Long Description</label>
                    <textarea
                      className="rte-form-textarea"
                      placeholder="Detailed description of the iframe content"
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="rte-form-group">
                    <label className="rte-form-label">Description URL</label>
                    <input
                      type="url"
                      className="rte-form-input"
                      placeholder="https://example.com/description"
                      value={descriptionUrl}
                      onChange={(e) => setDescriptionUrl(e.target.value)}
                    />
                  </div>

                  <div className="rte-form-group">
                    <label className="rte-checkbox-label">
                      <input
                        type="checkbox"
                        checked={showBorder}
                        onChange={(e) => setShowBorder(e.target.checked)}
                      />
                      Show iframe border
                    </label>
                  </div>

                  <div className="rte-form-group">
                    <label className="rte-checkbox-label">
                      <input
                        type="checkbox"
                        checked={enableScrollbar}
                        onChange={(e) => setEnableScrollbar(e.target.checked)}
                      />
                      Enable scrollbar
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rte-dialog-footer">
          <button type="button" className="rte-btn rte-btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="rte-btn rte-btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
