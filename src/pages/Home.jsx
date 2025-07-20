import React, { useEffect, useState } from "react";
import appWriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    appWriteService.getPosts([]).then((posts) => {
      setPosts(posts.documents);
    });
  }, []);
  if(posts.length === 0) {
    return(
        <div>
            <Container>
                    <div className='w-full'>
                        <h2 className='text-center text-2xl font-bold'>
                            No Posts Found
                        </h2>
                    </div>
            </Container>
        </div>
    )
  }
  return(
    <div className="w-full py-8">
        <Container>
            <div className="flex flex-wrap">
                {posts.map((post) => (
                    <div key={post.$id} className="py-2 w-1/4">
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default Home;
