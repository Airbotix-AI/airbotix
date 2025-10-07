// MediaAssets Component
// Handles media upload and management for workshops

import { Plus, Trash2 } from 'lucide-react'
import { WorkshopFormData } from '@/types/workshop'

interface MediaAssetsProps {
  formData: WorkshopFormData
  setField: (field: keyof WorkshopFormData, value: any) => void
  hasFieldError: (field: keyof WorkshopFormData) => boolean
  getFieldError: (field: keyof WorkshopFormData) => string | null
  // Photo functions
  addPhoto: (photo: any) => void
  removePhoto: (index: number) => void
  updatePhoto: (index: number, photo: any) => void
}

export default function MediaAssets({
  formData,
  setField,
  hasFieldError,
  getFieldError,
  addPhoto,
  removePhoto,
  updatePhoto
}: MediaAssetsProps) {
  return (
    <div className="space-y-6">
      {/* Video */}
      <div>
        <label htmlFor="videoSrc" className="block text-sm font-medium text-gray-700 mb-2">
          Video URL *
        </label>
        <input
          type="url"
          id="videoSrc"
          value={formData.media.video.src}
          onChange={(e) => setField('media', { ...formData.media, video: { ...formData.media.video, src: e.target.value } })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('media') ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="https://example.com/video.mp4"
          title="Video URL is required"
        />
        {hasFieldError('media') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('media')}</p>
        )}
      </div>

      {/* Video Poster */}
      <div>
        <label htmlFor="videoPoster" className="block text-sm font-medium text-gray-700 mb-2">
          Video Poster URL
        </label>
        <input
          type="url"
          id="videoPoster"
          value={formData.media.video.poster || ''}
          onChange={(e) => setField('media', { ...formData.media, video: { ...formData.media.video, poster: e.target.value } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/poster.jpg"
          title="Video poster URL"
        />
      </div>

      {/* Video Caption */}
      <div>
        <label htmlFor="videoCaption" className="block text-sm font-medium text-gray-700 mb-2">
          Video Caption
        </label>
        <input
          type="text"
          id="videoCaption"
          value={formData.media.video.caption || ''}
          onChange={(e) => setField('media', { ...formData.media, video: { ...formData.media.video, caption: e.target.value } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Video caption"
          title="Video caption"
        />
      </div>

      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Photos * (Minimum 1 required)
          </label>
          <button
            type="button"
            onClick={() => addPhoto({ src: '', alt: '' })}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            title="Add photo"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Photo
          </button>
        </div>
        <div className="space-y-3">
          {formData.media.photos.map((photo, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Photo {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="url"
                  value={photo.src}
                  onChange={(e) => updatePhoto(index, { ...photo, src: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/photo.jpg"
                  title="Photo URL"
                />
                <input
                  type="text"
                  value={photo.alt || ''}
                  onChange={(e) => updatePhoto(index, { ...photo, alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Photo alt text"
                  title="Photo alt text"
                />
              </div>
            </div>
          ))}
        </div>
        {hasFieldError('media') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('media')}</p>
        )}
      </div>
    </div>
  )
}