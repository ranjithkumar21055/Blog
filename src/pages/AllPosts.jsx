import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appWriteService from "../appwrite/config";
import { Query } from "appwrite";
import { useSelector } from "react-redux";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    appWriteService.getPosts([Query.equal("userId", userData.$id)]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);
  return (
    <div className="w-full py-8 gap-5">
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

export default AllPosts;
