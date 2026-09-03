'use client';

import { useState, type ChangeEvent } from 'react';

export function ImagePreview({ initialSrc, initialAlt }: { initialSrc?: string; initialAlt?: string }) {
  const [src, setSrc] = useState(initialSrc ?? '');

  return (
    <div className="admin-image-field">
      <div className="admin-image-preview">
        {src ? <img src={src} alt={initialAlt ?? ''} /> : <span>Nema slike</span>}
      </div>
      <label className="admin-file">
        <span>Izaberi sliku</span>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) setSrc(URL.createObjectURL(file));
          }}
        />
      </label>
    </div>
  );
}
