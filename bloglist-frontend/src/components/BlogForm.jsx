import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div className="blogDiv">
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="write title here"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="write author here"
          />
        </div>
        <div>
          url:
          <input
            id="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="write url here"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
