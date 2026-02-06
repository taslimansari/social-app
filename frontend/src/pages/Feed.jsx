import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <CreatePost onPostCreated={fetchPosts} />

      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          updatePost={(updatedPost) => {
            setPosts(prev =>
              prev.map(p => (p._id === updatedPost._id ? updatedPost : p))
            );
          }}
        />
      ))}
    </div>
  );
}
