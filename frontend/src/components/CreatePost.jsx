import { useState } from "react";
import API from "../services/api";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const submit = async () => {
    if (!text && !image) return alert("Add text or image");

    await API.post("/posts", { text, image });
    setText("");
    setImage("");
    onPostCreated();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <input
        placeholder="Image URL (optional)"
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <button onClick={submit}>Post</button>
    </div>
  );
}
