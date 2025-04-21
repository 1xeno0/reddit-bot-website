"use client";

import { useState, useEffect } from "react";
import VideoConfigTable from "./VideoConfigTable";
import VideoConfigEditor from "./VideoConfigEditor";
import VideoGenerationForm from "./VideoGenerationForm";

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

const VideoTab = () => {
  const [videoConfigs, setVideoConfigs] = useState<VideoConfigFile[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<VideoConfigFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);

  useEffect(() => {
    fetchVideoConfigs();
    fetchStories();
  }, []);

  const fetchVideoConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/get_video_configs");
      if (!response.ok) {
        throw new Error("Failed to fetch video configurations");
      }
      const data = await response.json();
      setVideoConfigs(data);
    } catch (err) {
      setError("Failed to fetch video configurations: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_stories");
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError("Failed to fetch stories: " + (err as Error).message);
    }
  };

  const handleEditConfig = (config: VideoConfigFile) => {
    setSelectedConfig(config);
    setIsEditing(true);
    setIsGenerating(false);
  };

  const handleDeleteConfig = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_video_config/${filename}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete video configuration");
      }
      
      setVideoConfigs(videoConfigs.filter(config => config.filename !== filename));
      
      if (selectedConfig?.filename === filename) {
        setSelectedConfig(null);
        setIsEditing(false);
      }
    } catch (err) {
      setError("Failed to delete video configuration: " + (err as Error).message);
    }
  };

  const handleUpdateConfig = async (updatedConfig: VideoConfigFile) => {
    try {
      const response = await fetch(`http://localhost:5000/update_video_config/${updatedConfig.filename}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfig.config),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update video configuration");
      }
      
      setVideoConfigs(videoConfigs.map(config => 
        config.filename === updatedConfig.filename ? updatedConfig : config
      ));
      
      setIsEditing(false);
      setSelectedConfig(null);
    } catch (err) {
      setError("Failed to update video configuration: " + (err as Error).message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedConfig(null);
  };

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    setIsEditing(false);
  };

  const handleStorySelection = (stories: Story[]) => {
    setSelectedStories(stories);
  };

  const handleVideoGeneration = async (storyFilename: string, videoFilename: string) => {
    try {
      const response = await fetch("http://localhost:5000/generate_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story_filename: storyFilename,
          video_filename: videoFilename
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate video");
      }
      
      const data = await response.json();
      setGeneratedVideos(prev => [...prev, data.video_output_path]);
      
      return data.video_output_path;
    } catch (err) {
      setError("Failed to generate video: " + (err as Error).message);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Video Configuration</h2>
        <div className="space-x-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={handleGenerateVideo}
          >
            Generate Video
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {isGenerating ? (
        <VideoGenerationForm 
          videoConfigs={videoConfigs}
          stories={stories}
          onGenerate={handleVideoGeneration}
          onCancel={() => setIsGenerating(false)}
          generatedVideos={generatedVideos}
        />
      ) : isEditing && selectedConfig ? (
        <VideoConfigEditor 
          videoConfig={selectedConfig}
          onUpdate={handleUpdateConfig}
          onCancel={handleCancelEdit}
        />
      ) : (
        <VideoConfigTable
          videoConfigs={videoConfigs}
          loading={loading}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
          onReload={fetchVideoConfigs}
        />
      )}

      {generatedVideos.length > 0 && !isGenerating && !isEditing && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Generated Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedVideos.map((videoPath, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-2 font-medium">{videoPath}</div>
                <div className="flex justify-end">
                  <a
                    href={`http://localhost:5000/get_video/${videoPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Download Video
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTab; 