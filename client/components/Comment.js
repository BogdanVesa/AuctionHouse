const Comment = ({comment}) => {
    return ( 
        <div>
            {comment.username}
            {comment.content}
        </div>
     );
}
 
export default Comment;