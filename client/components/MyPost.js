import PostItem from './PostItem';
import styles from '../styles/History.module.css'

const MyPost = ({myPosts}) => {
    return (
        <div className={styles.postList}>
            <div className={styles.title}>Your posts</div>
            {myPosts.map((post)=>(
                <PostItem key={post.postID} post={post}/>
            ))}
        </div>
    );
}
 
export default MyPost;