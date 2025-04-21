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

interface VideoConfigTableProps {
  videoConfigs: VideoConfigFile[];
  loading: boolean;
  onEdit: (videoConfig: VideoConfigFile) => void;
  onDelete: (filename: string) => void;
  onReload?: () => void;
}

const VideoConfigTable = ({ videoConfigs, loading, onEdit, onDelete, onReload }: VideoConfigTableProps) => {
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);

  const handleSelect = (filename: string) => {
    if (selectedConfigs.includes(filename)) {
      setSelectedConfigs(selectedConfigs.filter(id => id !== filename));
    } else {
      setSelectedConfigs([...selectedConfigs, filename]);
    }
  };

  const handleSelectAll = () => {
    if (selectedConfigs.length === videoConfigs.length) {
      setSelectedConfigs([]);
    } else {
      setSelectedConfigs(videoConfigs.map(config => config.filename));
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative">
      <div className="mb-4 flex justify-end">
        <button 
          onClick={onReload}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Reload Table
        </button>
      </div>

      {videoConfigs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No video configurations found.</p>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedConfigs.length === videoConfigs.length && videoConfigs.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filename
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Background
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Output Path
                </th>
                <th scope="col" className="sticky right-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videoConfigs.map((videoConfig) => (
                <tr key={videoConfig.filename} className={selectedConfigs.includes(videoConfig.filename) ? "bg-blue-50" : ""}>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedConfigs.includes(videoConfig.filename)}
                      onChange={() => handleSelect(videoConfig.filename)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{videoConfig.filename}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{truncateText(videoConfig.config.title_text, 30)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{truncateText(videoConfig.config.background_clips_folder, 30)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{videoConfig.config.voice_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{truncateText(videoConfig.config.video_output_path, 30)}</div>
                  </td>
                  <td className="sticky right-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(videoConfig)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(videoConfig.filename)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VideoConfigTable; 