"use client";

import { useState, useMemo, useEffect } from "react";

interface StoryConfig {
  title: string;
  url: string;
  subreddit: string;
  timestamp: string;
  score: string;
  author: string;
  num_comments: string;
  content: string;
  scrape_date: string;
}

interface Story {
  filename: string;
  config: StoryConfig;
}

interface StoryTableProps {
  stories: Story[];
  loading: boolean;
  onEdit: (story: Story) => void;
  onDelete: (filename: string) => void;
  onReload?: () => void;
  onSelectionChange?: (selectedFilenames: string[]) => void;
}

type SortKey = "title" | "subreddit" | "author" | "score" | "content" | "filename";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const StoryTable = ({ 
  stories, 
  loading, 
  onEdit, 
  onDelete, 
  onReload,
  onSelectionChange
}: StoryTableProps) => {
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "title", direction: "asc" });

  // Notify parent component when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedStories);
    }
  }, [selectedStories, onSelectionChange]);

  const handleSelect = (filename: string) => {
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === "asc" ? (
      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const sortedStories = useMemo(() => {
    // Create a copy of the stories array to avoid mutating props
    const sorted = [...stories];
    
    // Sort the stories based on the current sort configuration
    return sorted.sort((a, b) => {
      let aValue, bValue;
      
      // Determine the values to compare based on the sort key
      switch (sortConfig.key) {
        case "title":
          aValue = a.config.title.toLowerCase();
          bValue = b.config.title.toLowerCase();
          break;
        case "subreddit":
          aValue = a.config.subreddit.toLowerCase();
          bValue = b.config.subreddit.toLowerCase();
          break;
        case "author":
          aValue = a.config.author.toLowerCase();
          bValue = b.config.author.toLowerCase();
          break;
        case "score":
          aValue = parseInt(a.config.score) || 0;
          bValue = parseInt(b.config.score) || 0;
          break;
        case "content":
          aValue = a.config.content.toLowerCase();
          bValue = b.config.content.toLowerCase();
          break;
        case "filename":
          aValue = a.filename.toLowerCase();
          bValue = b.filename.toLowerCase();
          break;
        default:
          aValue = a.config.title.toLowerCase();
          bValue = b.config.title.toLowerCase();
      }
      
      // Compare the values
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [stories, sortConfig]);

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

      {stories.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No stories found. Try fetching new stories from Reddit.</p>
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStories.length === stories.length && stories.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      <span>Title</span>
                      <span className="ml-1">{getSortIcon("title")}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("subreddit")}
                  >
                    <div className="flex items-center">
                      <span>Subreddit</span>
                      <span className="ml-1">{getSortIcon("subreddit")}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center">
                      <span>Author</span>
                      <span className="ml-1">{getSortIcon("author")}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("score")}
                  >
                    <div className="flex items-center">
                      <span>Score</span>
                      <span className="ml-1">{getSortIcon("score")}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("content")}
                  >
                    <div className="flex items-center">
                      <span>Content</span>
                      <span className="ml-1">{getSortIcon("content")}</span>
                    </div>
                  </th>
                  <th scope="col" className="sticky right-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStories.map((story) => (
                  <tr key={story.filename} className={selectedStories.includes(story.filename) ? "bg-blue-50" : ""}>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStories.includes(story.filename)}
                        onChange={() => handleSelect(story.filename)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{story.config.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {truncateText(story.config.content, 100)}
                      </div>
                    </td>
                    <td className="sticky right-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEdit(story)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(story.filename)}
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
          
          {selectedStories.length > 0 && (
            <div className="bg-gray-50 p-4 mt-4 rounded-md">
              <div className="text-sm text-gray-500">
                {selectedStories.length} {selectedStories.length === 1 ? "story" : "stories"} selected
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoryTable; 