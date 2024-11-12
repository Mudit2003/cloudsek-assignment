import React, { useState, useEffect } from 'react';
import './Pagination.css';

interface Post {
  id: number;
  content: string;
  author: string;
}

interface PaginationProps {
  loadPosts: (page: number) => Promise<Post[]>;
}

const Pagination: React.FC<PaginationProps> = ({ loadPosts }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const newPosts = await loadPosts(page);
      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else {
        setHasMore(false); // No more posts to load
      }
    };
    fetchPosts();
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <h2>Posts</h2>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <h3>{post.author}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      {hasMore ? (
        <button onClick={loadMore} className="load-more-button">
          Load More
        </button>
      ) : (
        <p>No more posts to load.</p>
      )}
    </div>
  );
};

export default Pagination;
