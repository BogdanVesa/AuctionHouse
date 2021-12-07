import TagPostItem from "./TagPostItem";
import styles from "../styles/Post.module.css"

const TagPost = ({tagList}) => {
    return ( 
        <div className={styles.tagList}>
            {tagList.map((tag)=>(
                <TagPostItem  key={tag.name} tag={tag}></TagPostItem>
        ))}</div>
     );
}
 
export default TagPost;