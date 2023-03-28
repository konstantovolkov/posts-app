import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const putLike = async ({ id, reactions }) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "PUT" /* or PATCH */,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reactions
    })
  });

  if (response.ok) {
    return await response.json();
  }
};

const getPosts = async () => {
  const response = await fetch("https://dummyjson.com/posts");

  if (response.ok) {
    return (await response.json()).posts;
  }
};

const usePosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);

  const addLike = async ({ postId, reactions }) => {
    setPosts((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: reactions
          };
        }

        return post;
      })
    );
  };

  return { posts, addLike };
};

export default function App() {
  const { posts, addLike } = usePosts();

  return <PostsList posts={posts} onLike={addLike} />;
}

const PostsList = ({ posts, onLike }) => (
  <Stack spacing={4}>
    {posts.map(({ title, body, reactions, tags, id }) => (
      <Post
        key={id}
        title={title}
        body={body}
        reactions={reactions}
        tags={tags}
        postId={id}
        onLike={onLike}
      />
    ))}
  </Stack>
);

const Post = ({ title, body, reactions, tags, postId, onLike }) => {
  const [isSendingLike, setIsSendingLike] = useState(false);

  return (
    <Card variant="outlined">
      <CardHeader color="black" title={title} />
      <CardContent>
        <Typography variant="body2">{body}</Typography>
        <Stack direction="row" spacing={1} marginTop={2}>
          {tags?.map((tag) => (
            <Chip key={tag} size="small" label={tag} />
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          size="small"
          onClick={async () => {
            setIsSendingLike(true);
            const updatedPost = await putLike({ id: postId, reactions });
            setIsSendingLike(false);

            onLike({ postId, reactions: reactions + 1 });
          }}
        >
          <FavoriteIcon sx={{ marginRight: "8px" }} color="error" />{" "}
          {isSendingLike ? (
            <CircularProgress size="16px" />
          ) : (
            <Typography variant="body2" color="GrayText">
              {reactions}
            </Typography>
          )}
        </Button>
        <Button size="small">Read More</Button>
      </CardActions>
    </Card>
  );
};
