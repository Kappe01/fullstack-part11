import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import ErrorMessage from "./components/ErrorMessage";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessmessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const returnedBlog = await blogService.create(blogObject);

    setBlogs(blogs.concat(returnedBlog));

    setSuccessmessage(`a new blog ${blogObject.title} by ${blogObject.author}`);
    setTimeout(() => {
      setSuccessmessage(null);
    }, 5000);
  };

  const addLike = async (blog) => {
    await blogService.update(blog.id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    });
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  const sortBlogsByLikes = (blogs) => {
    return blogs.slice().sort((a, b) => b.likes - a.likes);
  };

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      await blogService.remove(blog.id);
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.removeToken(null);
    setUser(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const blogForm = () => {
    return (
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    );
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={successMessage} />
      <ErrorMessage message={errorMessage} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>Logout</button>
          </p>
          {blogForm()}
        </div>
      )}
      {sortBlogsByLikes(blogs).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          deleteBlog={deleteBlog}
          addLike={addLike}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;
