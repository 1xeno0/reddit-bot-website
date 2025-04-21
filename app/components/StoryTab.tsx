"use client";

import { useState, useEffect } from "react";
import StoryTable from "./StoryTable";
import StoryEditor from "./StoryEditor";
import VideoGenerationForm from "./VideoGenerationForm";

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

interface VideoConfig {
  filename: string;
  config: {
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
  };
}

interface StoryTabProps {
  onSwitchToVideos?: () => void;
}

const StoryTab = ({ onSwitchToVideos }: StoryTabProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchingStories, setFetchingStories] = useState(false);
  const [clearingStories, setClearingStories] = useState(false);
  const [subreddit, setSubreddit] = useState<string>("stories");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoConfigs, setVideoConfigs] = useState<VideoConfig[]>([]);
  const [loadingVideoConfigs, setLoadingVideoConfigs] = useState(false);

  useEffect(() => {
    fetchStories();
    fetchVideoConfigs();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/get_stories");
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError("Failed to fetch stories: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoConfigs = async () => {
    try {
      setLoadingVideoConfigs(true);
      const response = await fetch("http://localhost:5000/get_video_configs");
      if (!response.ok) {
        throw new Error("Failed to fetch video configurations");
      }
      const data = await response.json();
      setVideoConfigs(data);
    } catch (err) {
      setError("Failed to fetch video configurations: " + (err as Error).message);
    } finally {
      setLoadingVideoConfigs(false);
    }
  };

  const handleFetchNewStories = async () => {
    try {
      setFetchingStories(true);
      const response = await fetch("http://localhost:5000/get_new_stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subreddit }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch new stories");
      }
      
      await fetchStories(); // Refresh the list after fetching new stories
    } catch (err) {
      setError("Failed to fetch new stories: " + (err as Error).message);
    } finally {
      setFetchingStories(false);
    }
  };

  const handleClearAllStories = async () => {
    try {
      setClearingStories(true);
      
      // Delete each story one by one
      const deletePromises = stories.map(story => 
        fetch(`http://localhost:5000/delete_story/${story.filename}`, {
          method: "DELETE",
        })
      );
      
      await Promise.all(deletePromises);
      
      // Clear the local stories array
      setStories([]);
      setShowConfirmClear(false);
      
    } catch (err) {
      setError("Failed to clear stories: " + (err as Error).message);
    } finally {
      setClearingStories(false);
    }
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setIsEditing(true);
  };

  const handleDeleteStory = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_story/${filename}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete story");
      }
      
      setStories(stories.filter(story => story.filename !== filename));
      
      if (selectedStory?.filename === filename) {
        setSelectedStory(null);
        setIsEditing(false);
      }
    } catch (err) {
      setError("Failed to delete story: " + (err as Error).message);
    }
  };

  const handleUpdateStory = async (updatedStory: Story) => {
    try {
      const response = await fetch(`http://localhost:5000/update_story/${updatedStory.filename}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStory.config),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update story");
      }
      
      setStories(stories.map(story => 
        story.filename === updatedStory.filename ? updatedStory : story
      ));
      
      setIsEditing(false);
      setSelectedStory(null);
    } catch (err) {
      setError("Failed to update story: " + (err as Error).message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedStory(null);
  };

  const handleSelectionChange = (selectedFilenames: string[]) => {
    setSelectedStoryIds(selectedFilenames);
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
  };

  const handleCancelVideoGeneration = () => {
    setIsGeneratingVideo(false);
  };

  const handleVideoGeneration = async (storyFilename: string, videoConfigFilename: string) => {
    try {
      const response = await fetch("http://localhost:5000/generate_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story_filename: storyFilename,
          video_filename: videoConfigFilename
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate video");
      }
      
      const data = await response.json();
      return data.video_output_path;
    } catch (err) {
      setError("Failed to generate video: " + (err as Error).message);
      return null;
    }
  };

  // Get selected stories objects from their IDs
  const getSelectedStories = () => {
    return stories.filter(story => selectedStoryIds.includes(story.filename));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">Reddit Stories</h2>
          {stories.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red transition ease-in-out duration-150"
              disabled={clearingStories || loading}
            >
              {clearingStories ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Clearing...
                </>
              ) : (
                <>
                  <svg className="mr-1.5 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All Stories
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateVideo}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center ${
              selectedStoryIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={selectedStoryIds.length === 0}
            title={selectedStoryIds.length === 0 ? "Select stories first" : "Generate videos from selected stories"}
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Generate Video {selectedStoryIds.length > 0 && `(${selectedStoryIds.length})`}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            placeholder="Subreddit name"
            className="block w-full rounded-md border-gray-300 pl-3 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleFetchNewStories}
          disabled={fetchingStories || !subreddit.trim()}
        >
          {fetchingStories ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching...
            </>
          ) : (
            "Fetch New Stories"
          )}
        </button>
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

      {showConfirmClear && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
          <p className="mb-2">Are you sure you want to delete all stories? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowConfirmClear(false)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAllStories}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Yes, Delete All
            </button>
          </div>
        </div>
      )}

      {isEditing && selectedStory ? (
        <StoryEditor 
          story={selectedStory}
          onUpdate={handleUpdateStory}
          onCancel={handleCancelEdit}
        />
      ) : isGeneratingVideo ? (
        <VideoGenerationForm 
          videoConfigs={videoConfigs}
          stories={getSelectedStories()}
          onGenerate={handleVideoGeneration}
          onCancel={handleCancelVideoGeneration}
          generatedVideos={[]}
        />
      ) : (
        <StoryTable
          stories={stories}
          loading={loading}
          onEdit={handleEditStory}
          onDelete={handleDeleteStory}
          onReload={fetchStories}
          onSelectionChange={handleSelectionChange}
        />
      )}

      {selectedStoryIds.length > 0 && !isGeneratingVideo && !isEditing && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500">
            {selectedStoryIds.length} {selectedStoryIds.length === 1 ? "story" : "stories"} selected
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryTab; 