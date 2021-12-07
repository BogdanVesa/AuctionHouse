import Comment from '../components/Comment'
import styles from '../styles/Post.module.css'

const CommentList = ({commentList}) => {
    return ( 
        <div className={styles.commentList}>
            {commentList.map((comment)=>(
                <Comment key={comment.commentID} comment={comment}></Comment>
            ))}
        </div>
     );
}
 
export default CommentList;