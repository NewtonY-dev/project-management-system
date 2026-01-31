function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommentItem({ comment }) {
  return (
    <div className="comment-item">
      <div className="comment-item__header">
        <span className="comment-item__author">{comment.author_name}</span>
        <span className="comment-item__timestamp">
          {formatDate(comment.created_at)}
        </span>
      </div>
      <div className="comment-item__content">{comment.content}</div>
    </div>
  );
}

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="comment-list__empty">
        <p>No comments yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <h3 className="comment-list__title">Comments ({comments.length})</h3>
      <div className="comment-list__comments">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
