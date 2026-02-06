import { useState } from "react";
import API from "../services/api";

export default function PostCard({ post, updatePost }) {
  const [comment, setComment] = useState("");

  const like = async () => {
    const res = await API.put(`/posts/${post._id}/like`);
    updatePost(res.data);
  };

  const addComment = async () => {
    if (!comment) return;
    const res = await API.post(`/posts/${post._id}/comment`, {
      text: comment
    });
    setComment("");
    updatePost(res.data);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 15, marginBottom: 15 }}>
      <h4>{post.username}</h4>

      {post.text && <p>{post.text}</p>}

      {post.image && (
        <img
          src={post.image}
          alt=""
          style={{ width: "100%", borderRadius: 8 }}
        />
      )}

      <button onClick={like}>
        ❤️ {post.likes.length}
      </button>

      <div>
        <input
          placeholder="Add comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button onClick={addComment}>Comment</button>
      </div>

      <small>{post.comments.length} comments</small>
    </div>
  );
}
