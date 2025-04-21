"use client";

import { useState } from "react";

interface VideoConfig {
  main_text: string;
  title_text: string;
  video_output_path: string;
  background_clips_folder: string;
  temp_voices_folder: string;
  temp_audio_folder: string;
  capitalize: boolean;
  audio_temp_name: string;
  pause_duration: number;
  background_audio_path: string;
  voice_name: string;
  voice_title_output_name: string;
  voice_text_output_name: string;
  label_name: string;
  font_path: string;
  font_size: number;
  color: string;
  position: string;
  caption_box_width: number;
}

interface VideoConfigFile {
  filename: string;
  config: VideoConfig;
}

interface VideoConfigEditorProps {
  videoConfig: VideoConfigFile;
  onUpdate: (updatedConfig: VideoConfigFile) => void;
  onCancel: () => void;
}

const VideoConfigEditor = ({ videoConfig, onUpdate, onCancel }: VideoConfigEditorProps) => {
  const [editedConfig, setEditedConfig] = useState<VideoConfigFile>({
    ...videoConfig,
    config: { ...videoConfig.config }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle different input types
    let processedValue: any = value;
    if (type === "number") {
      processedValue = Number(value);
    } else if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setEditedConfig({
      ...editedConfig,
      config: {
        ...editedConfig.config,
        [name]: processedValue
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedConfig);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Edit Video Configuration</h3>
        <div className="text-sm text-gray-500">File: {videoConfig.filename}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title_text" className="block text-sm font-medium text-gray-700 mb-1">
              Title Text
            </label>
            <input
              type="text"
              name="title_text"
              id="title_text"
              value={editedConfig.config.title_text}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="video_output_path" className="block text-sm font-medium text-gray-700 mb-1">
              Video Output Path
            </label>
            <input
              type="text"
              name="video_output_path"
              id="video_output_path"
              value={editedConfig.config.video_output_path}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="background_clips_folder" className="block text-sm font-medium text-gray-700 mb-1">
              Background Clips Folder
            </label>
            <input
              type="text"
              name="background_clips_folder"
              id="background_clips_folder"
              value={editedConfig.config.background_clips_folder}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="background_audio_path" className="block text-sm font-medium text-gray-700 mb-1">
              Background Audio Path
            </label>
            <input
              type="text"
              name="background_audio_path"
              id="background_audio_path"
              value={editedConfig.config.background_audio_path}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="temp_voices_folder" className="block text-sm font-medium text-gray-700 mb-1">
              Temp Voices Folder
            </label>
            <input
              type="text"
              name="temp_voices_folder"
              id="temp_voices_folder"
              value={editedConfig.config.temp_voices_folder}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="temp_audio_folder" className="block text-sm font-medium text-gray-700 mb-1">
              Temp Audio Folder
            </label>
            <input
              type="text"
              name="temp_audio_folder"
              id="temp_audio_folder"
              value={editedConfig.config.temp_audio_folder}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="voice_name" className="block text-sm font-medium text-gray-700 mb-1">
              Voice Name
            </label>
            <input
              type="text"
              name="voice_name"
              id="voice_name"
              value={editedConfig.config.voice_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="voice_title_output_name" className="block text-sm font-medium text-gray-700 mb-1">
              Voice Title Output Name
            </label>
            <input
              type="text"
              name="voice_title_output_name"
              id="voice_title_output_name"
              value={editedConfig.config.voice_title_output_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="voice_text_output_name" className="block text-sm font-medium text-gray-700 mb-1">
              Voice Text Output Name
            </label>
            <input
              type="text"
              name="voice_text_output_name"
              id="voice_text_output_name"
              value={editedConfig.config.voice_text_output_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="font_path" className="block text-sm font-medium text-gray-700 mb-1">
              Font Path
            </label>
            <input
              type="text"
              name="font_path"
              id="font_path"
              value={editedConfig.config.font_path}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="font_size" className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="number"
              name="font_size"
              id="font_size"
              value={editedConfig.config.font_size}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={editedConfig.config.color}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              name="position"
              id="position"
              value={editedConfig.config.position}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="caption_box_width" className="block text-sm font-medium text-gray-700 mb-1">
              Caption Box Width
            </label>
            <input
              type="number"
              name="caption_box_width"
              id="caption_box_width"
              value={editedConfig.config.caption_box_width}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="pause_duration" className="block text-sm font-medium text-gray-700 mb-1">
              Pause Duration
            </label>
            <input
              type="number"
              name="pause_duration"
              id="pause_duration"
              value={editedConfig.config.pause_duration}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="audio_temp_name" className="block text-sm font-medium text-gray-700 mb-1">
              Audio Temp Name
            </label>
            <input
              type="text"
              name="audio_temp_name"
              id="audio_temp_name"
              value={editedConfig.config.audio_temp_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="capitalize"
              id="capitalize"
              checked={editedConfig.config.capitalize}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="capitalize" className="ml-2 block text-sm text-gray-900">
              Capitalize
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="main_text" className="block text-sm font-medium text-gray-700 mb-1">
            Main Text
          </label>
          <textarea
            name="main_text"
            id="main_text"
            rows={4}
            value={editedConfig.config.main_text}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoConfigEditor; 