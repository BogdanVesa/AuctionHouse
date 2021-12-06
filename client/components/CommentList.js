import Comment from '../components/Comment'

const CommentList = ({commentList}) => {
    return ( 
        <div>
            {commentList.map((comment)=>(
                <Comment key={comment.commentID} comment={comment}></Comment>
            ))}
        </div>
     );
}
 
export default CommentList;