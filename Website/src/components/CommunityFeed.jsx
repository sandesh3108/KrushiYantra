import { useState } from "react";

// Dummy posts with crop categories, media, username and timestamp
const dummyPosts = [
  {
    _id: "1",
    username: "Alice",
    timestamp: "Feb 21, 2025, 09:30 AM",
    text: "Hello, this is my first article about Wheat.",
    crop: "Wheat",
    likes: 5,
    dislikes: 1,
    comments: ["Great article!", "Very informative."],
    media: null,
    mediaType: null,
    type: "article",
  },
  {
    _id: "2",
    username: "Bob",
    timestamp: "Feb 21, 2025, 10:45 AM",
    text: "Check out this image of Rice fields!",
    crop: "Rice",
    likes: 3,
    dislikes: 0,
    comments: ["Stunning view.", "Love it!"],
    media: "https://plus.unsplash.com/premium_photo-1661420226112-311050ce30da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Dummy image URL
    mediaType: "image",
    type: "image",
  },
  {
    _id: "3",
    username: "Charlie",
    timestamp: "Feb 21, 2025, 11:00 AM",
    text: "Maize harvest video - see how it goes!",
    crop: "Maize",
    likes: 2,
    dislikes: 2,
    comments: ["Amazing harvest!", "Wow!"],
    media: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    mediaType: "video",
    type: "video",
  },
];

// Available crop options (for filtering and post tagging)
const availableCrops = ["All", "Wheat", "Rice", "Maize"];

const CommunityFeed = () => {
  // New post states
  const [postType, setPostType] = useState("article"); // "article", "image", "video"
  const [newPostText, setNewPostText] = useState("");
  const [newPostCrop, setNewPostCrop] = useState("Wheat"); // default crop selection
  const [newMediaData, setNewMediaData] = useState(null); // { media: <data>, type: "image" or "video" }

  // Posts state and filter
  const [posts, setPosts] = useState(dummyPosts);
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");

  // Handle file input change for image/video posts
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read file as Data URL for preview purposes.
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaData({ media: reader.result, type: postType });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    if (!newPostText.trim()) return;
    const newPostObj = {
      _id: Date.now().toString(),
      username: "CurrentUser", // hardcoded username for new posts
      timestamp: new Date().toLocaleString(), // current date/time
      text: newPostText,
      crop: newPostCrop,
      likes: 0,
      dislikes: 0,
      comments: [],
      // Only include media for image/video posts
      media: postType === "article" ? null : newMediaData?.media,
      mediaType: postType === "article" ? null : postType,
      type: postType,
    };
    setPosts([newPostObj, ...posts]);
    // Reset new post fields
    setNewPostText("");
    setNewMediaData(null);
  };

  const toggleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post._id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const toggleDislike = (id) => {
    setPosts(
      posts.map((post) =>
        post._id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  const addComment = (id, comment) => {
    if (!comment.trim()) return;
    setPosts(
      posts.map((post) =>
        post._id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  const filteredPosts =
    selectedCropFilter === "All"
      ? posts
      : posts.filter((post) => post.crop === selectedCropFilter);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Community Posts</h2>

      {/* New Post Creation Section */}
      <div className="mb-4 border p-4 rounded">
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setPostType("article")}
            className={`px-4 py-2 rounded ${
              postType === "article" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Write Article
          </button>
          <button
            onClick={() => setPostType("image")}
            className={`px-4 py-2 rounded ${
              postType === "image" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Image
          </button>
          <button
            onClick={() => setPostType("video")}
            className={`px-4 py-2 rounded ${
              postType === "video" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Video
          </button>
        </div>

        {postType === "article" && (
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Write your article..."
            className="w-full p-2 border rounded mb-2"
          ></textarea>
        )}

        {(postType === "image" || postType === "video") && (
          <>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Write a caption..."
              className="w-full p-2 border rounded mb-2"
            ></textarea>
            <input
              type="file"
              accept={postType === "image" ? "image/*" : "video/*"}
              onChange={handleMediaChange}
              className="mb-2"
            />
            {newMediaData && (
              <div className="mb-2">
                {postType === "image" ? (
                  <img
                    src={newMediaData.media}
                    alt="Preview"
                    className="w-full h-auto rounded"
                  />
                ) : (
                  <video controls className="w-full rounded">
                    <source src={newMediaData.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </>
        )}

        <div className="mb-2">
          <label className="mr-2">Select Crop:</label>
          <select
            value={newPostCrop}
            onChange={(e) => setNewPostCrop(e.target.value)}
            className="border p-2 rounded"
          >
            {availableCrops.slice(1).map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handlePostSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      {/* Crop Filter Section */}
      <div className="mb-4">
        <label>Filter by Crop: </label>
        <select
          value={selectedCropFilter}
          onChange={(e) => setSelectedCropFilter(e.target.value)}
          className="border p-2 rounded"
        >
          {availableCrops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>

      {/* Display Posts */}
      {filteredPosts.map((post) => (
        <div key={post._id} className="border p-4 mb-4 rounded shadow">
          <div className="mb-2">
            <span className="font-bold">{post.username}</span> •{" "}
            <span className="text-sm text-gray-500">{post.timestamp}</span>
          </div>
          <p className="mb-2">{post.text}</p>
          <p className="text-sm text-gray-500 mb-2">Crop: {post.crop}</p>
          {post.media && (
            <div className="mb-2">
              {post.mediaType === "image" ? (
                <img
                  src={post.media}
                  alt="Post media"
                  className="w-full h-auto rounded"
                />
              ) : (
                <video controls className="w-full rounded">
                  <source src={post.media} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => toggleLike(post._id)} className="text-blue-500">
              👍 {post.likes}
            </button>
            <button onClick={() => toggleDislike(post._id)} className="text-red-500">
              👎 {post.dislikes}
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Add a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(post._id, e.target.value);
                  e.target.value = "";
                }
              }}
              className="border p-2 w-full rounded mb-2"
            />
            {post.comments.map((comment, index) => (
              <p key={index} className="text-sm text-gray-600">
                {comment}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityFeed;
