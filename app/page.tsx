"use client";

import { useState, useEffect } from "react";
import StoryTab from "./components/StoryTab";
import VideoTab from "./components/VideoTab";
import VideoOutputTab from "./components/VideoOutputTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stories");

  const handleSwitchToVideos = () => {
    setActiveTab("videos");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Reddit Video Generator</h1>
      </header>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            data-tab="stories"
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "stories"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("stories")}
          >
            Stories
          </button>
          <button
            data-tab="videos"
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "videos"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Video Configs
          </button>
          <button
            data-tab="output"
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "output"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("output")}
          >
            Generated Videos
          </button>
        </div>
      </div>

      <main>
        {activeTab === "stories" ? (
          <StoryTab onSwitchToVideos={handleSwitchToVideos} />
        ) : activeTab === "videos" ? (
          <VideoTab />
        ) : (
          <VideoOutputTab />
        )}
      </main>
    </div>
  );
}
