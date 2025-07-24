import React, { useEffect, useState } from "react";
import appWriteService from "../appwrite/config";
import { Button, Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate()
  useEffect(() => {
    if (authStatus) {
      appWriteService.getPosts([]).then((posts) => {
        setPosts(posts.documents);
      });
    }
  }, [authStatus]);
  if (!authStatus) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold">
                Login to read posts
              </h1>
              <Button className="mt-10 min-w-[150px]" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap gap-5">
          {posts.map((post) => (
            <div key={post.$id} className="py-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
