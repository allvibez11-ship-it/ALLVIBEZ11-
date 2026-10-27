import React, { useState } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MediaItem } from '../../../types';
import { api } from '../../../services/api';

interface MediaTabProps {
  media: MediaItem[];
  onRefresh: () => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ media, onRefresh }) => {
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPEG, PNG, WebP) are supported');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file must be under 15MB');
      return;
    }

    setError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await api.uploadMedia({
          name: file.name,
          base64Data: reader.result as string,
          type: file.type,
        });
        onRefresh();
      } catch (err: any) {
        setError(err.message || 'Image upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete media asset "${name}"?`)) return;
    try {
      await api.deleteMedia(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete media item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Media Asset Library
          </h2>
          <p className="text-xs text-slate-400">
            Upload and manage high-resolution photography for articles and featured headers.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 self-start sm:self-auto transition">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-lg"
          >
            <div className="h-40 bg-slate-950 relative overflow-hidden">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/80 text-slate-300 backdrop-blur-sm border border-slate-800">
                {Math.round(item.size / 1024)} KB
              </span>
            </div>

            <div className="p-3 space-y-2">
              <p className="text-xs font-bold text-white truncate" title={item.name}>
                {item.name}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
