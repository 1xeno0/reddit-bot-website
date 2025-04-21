"use client";

import { useState } from "react";

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

interface StoryEditorProps {
  story: Story;
  onUpdate: (updatedStory: Story) => void;
  onCancel: () => void;
}

const StoryEditor = ({ story, onUpdate, onCancel }: StoryEditorProps) => {
  const [editedStory, setEditedStory] = useState<Story>({
    ...story,
    config: { ...story.config }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedStory({
      ...editedStory,
      config: {
        ...editedStory.config,
        [name]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedStory);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Edit Story</h3>
        <div className="text-sm text-gray-500">File: {story.filename}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={editedStory.config.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={editedStory.config.url}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="subreddit" className="block text-sm font-medium text-gray-700 mb-1">
              Subreddit
            </label>
            <input
              type="text"
              name="subreddit"
              id="subreddit"
              value={editedStory.config.subreddit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={editedStory.config.author}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
              Score
            </label>
            <input
              type="text"
              name="score"
              id="score"
              value={editedStory.config.score}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="num_comments" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Comments
            </label>
            <input
              type="text"
              name="num_comments"
              id="num_comments"
              value={editedStory.config.num_comments}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-1">
              Timestamp
            </label>
            <input
              type="text"
              name="timestamp"
              id="timestamp"
              value={editedStory.config.timestamp}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="scrape_date" className="block text-sm font-medium text-gray-700 mb-1">
              Scrape Date
            </label>
            <input
              type="text"
              name="scrape_date"
              id="scrape_date"
              value={editedStory.config.scrape_date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={10}
            value={editedStory.config.content}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
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

export default StoryEditor; 