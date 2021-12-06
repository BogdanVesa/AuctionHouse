import BidItem from "./BidItem";

const MyPost = ({myPosts}) => {
    return (
        <div>
            {myPosts.map((post)=>(
                <BidItem key={post.postID} post={post}/>
            ))}
        </div>
    );
}
 
export default MyPost;