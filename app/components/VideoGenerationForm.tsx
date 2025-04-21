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

interface Story {
  filename: string;
  config: {
    title: string;
    url: string;
    subreddit: string;
    timestamp: string;
    score: string;
    author: string;
    num_comments: string;
    content: string;
    scrape_date: string;
  };
}

interface VideoGenerationFormProps {
  videoConfigs: VideoConfigFile[];
  stories: Story[];
  onGenerate: (storyFilename: string, videoFilename: string) => Promise<string | null>;
  onCancel: () => void;
  generatedVideos: string[];
}

const VideoGenerationForm = ({ 
  videoConfigs, 
  stories, 
  onGenerate, 
  onCancel,
  generatedVideos 
}: VideoGenerationFormProps) => {
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [selectedVideoConfig, setSelectedVideoConfig] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState<string | null>(null);
  const [successfulGenerations, setSuccessfulGenerations] = useState<string[]>([]);
  const [failedGenerations, setFailedGenerations] = useState<string[]>([]);

  const handleStorySelect = (filename: string) => {
    if (selectedStories.includes(filename)) {
      setSelectedStories(selectedStories.filter(id => id !== filename));
    } else {
      setSelectedStories([...selectedStories, filename]);
    }
  };

  const handleSelectAll = () => {
    if (selectedStories.length === stories.length) {
      setSelectedStories([]);
    } else {
      setSelectedStories(stories.map(story => story.filename));
    }
  };

  const handleGenerateVideos = async () => {
    if (selectedStories.length === 0 || !selectedVideoConfig) {
      return;
    }

    setGenerating(true);
    setSuccessfulGenerations([]);
    setFailedGenerations([]);

    for (const storyFilename of selectedStories) {
      setCurrentProcessing(storyFilename);
      const result = await onGenerate(storyFilename, selectedVideoConfig);
      
      if (result) {
        setSuccessfulGenerations(prev => [...prev, storyFilename]);
      } else {
        setFailedGenerations(prev => [...prev, storyFilename]);
      }
    }

    setCurrentProcessing(null);
    setGenerating(false);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStoryByFilename = (filename: string) => {
    return stories.find(story => story.filename === filename);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Generate Videos</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Video Configuration
        </label>
        <select
          value={selectedVideoConfig}
          onChange={(e) => setSelectedVideoConfig(e.target.value)}
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={generating}
        >
          <option value="">Select a video configuration</option>
          {videoConfigs.map((config) => (
            <option key={config.filename} value={config.filename}>
              {config.filename} - {truncateText(config.config.title_text, 30)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Stories
          </label>
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
            disabled={generating}
          >
            {selectedStories.length === stories.length && stories.length > 0
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <span className="sr-only">Select</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subreddit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stories.map((story) => (
                  <tr 
                    key={story.filename} 
                    className={`${selectedStories.includes(story.filename) ? "bg-blue-50" : ""} ${
                      currentProcessing === story.filename ? "bg-yellow-50" : ""
                    } ${
                      successfulGenerations.includes(story.filename) ? "bg-green-50" : ""
                    } ${
                      failedGenerations.includes(story.filename) ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStories.includes(story.filename)}
                        onChange={() => handleStorySelect(story.filename)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={generating}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {truncateText(story.config.title, 50)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{story.config.subreddit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{story.config.author}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedStories.length} {selectedStories.length === 1 ? "story" : "stories"} selected
        </div>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={generating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateVideos}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              selectedStories.length > 0 && selectedVideoConfig
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            }`}
            disabled={selectedStories.length === 0 || !selectedVideoConfig || generating}
          >
            {generating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Videos"
            )}
          </button>
        </div>
      </div>

      {(successfulGenerations.length > 0 || failedGenerations.length > 0) && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Generation Results</h4>
          
          {successfulGenerations.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm text-green-600 mb-1">Successfully Generated:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {successfulGenerations.map((filename) => {
                  const story = getStoryByFilename(filename);
                  return (
                    <li key={filename} className="flex justify-between">
                      <span>{story ? truncateText(story.config.title, 50) : filename}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {failedGenerations.length > 0 && (
            <div>
              <h5 className="text-sm text-red-600 mb-1">Failed to Generate:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {failedGenerations.map((filename) => {
                  const story = getStoryByFilename(filename);
                  return (
                    <li key={filename}>{story ? truncateText(story.config.title, 50) : filename}</li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGenerationForm; 