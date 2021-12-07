import styles from "../styles/Post.module.css"

const TagPostItem = ({tag}) => {
    return ( 
        <div className={styles.tagItem}>
            {tag}
        </div>
     );
}
 
export default TagPostItem;