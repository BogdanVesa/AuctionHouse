import { formatWithValidation } from 'next/dist/shared/lib/utils';
import styles from '../styles/Post.module.css'
import format from 'date-fns/format'

const Comment = ({comment}) => {
    return ( 
        <div className={styles.comment}>
            <div className={styles.username}>
                <div>{comment.username}</div>
                <div>{format(Date.parse(comment.createdAt), 'd.MM.Y H:m')}</div>
                </div>
            {comment.content}
        </div>
     );
}
 
export default Comment;