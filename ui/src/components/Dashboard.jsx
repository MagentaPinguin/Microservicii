import { useEffect, useState } from "react";

import { apiGet, apiPost } from "../api";

function NewsCard({ name, content, time }) {
  return (
    <div className="news-card">
      <h3>{name}</h3>
      <p>{content}</p>
      <p>{time}</p>
    </div>
  );
}

export default function Dashboard({ onLogout }) {
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [img_src, setImg] = useState("");
  const [score_click, setScoreClick] = useState(0);
  const [details, setDetails] = useState("");

  const postNews = async () => {
    try {
      const data = await apiPost("/post/", { details });
      // backend returns: { ok: true, post: {...} }

      setPosts((prev) => [data.post, ...prev]); // add new one on top
      setDetails(""); // clear input
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    apiGet("/auth/me")
      .then((response) => {
        setMe(response.user);
      })
      .catch((error) => {
        console.log(error);
        onLogout();
      });

    apiGet("/faas/random-image")
      .then((response) => {
        console.log(response.url);
        setImg(response.url);
      })
      .catch((error) => {
        console.log(error);
      });

    apiGet("/post/")
      .then((response) => {
        setPosts(response.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    me && (
      <div className="dashboard ">
        <div className="user-data full shadow">
          <p className="graffiti">USER DETAILS</p>
          <p>HELLO {me?.name}</p>

          <p>Clickscore: {score_click}</p>

          <div className="spaced">
            <button
              type="button"
              onClick={() => {
                setScoreClick(score_click + 1);
              }}
            >
              Click me!
            </button>
            <button type="button" onClick={() => onLogout()}>
              Logout
            </button>
          </div>
        </div>
        <div className="posts full shadow">
          <p className="graffiti">POSTĂRI</p>
          <div className="wrapper">
            <ul className="list">
              {posts.map(({ id, details, owner_name, created_at }) => (
                <NewsCard
                  key={id}
                  name={owner_name}
                  content={details}
                  time={new Date(created_at).toLocaleDateString("ro")}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="post-create full shadow">
          <p className="graffiti">CREATE A NEW POST</p>

          <textarea
            className="post-textarea"
            placeholder="Write your post here..."
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
          <button
            onClick={() => {
              postNews();
            }}
            type="button"
          >
            Create Post
          </button>

          <div className="faasimg">
            {img_src && <img src={img_src} alt="loading" />}
          </div>
        </div>
      </div>
    )
  );
}
