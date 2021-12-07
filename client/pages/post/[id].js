import Axios from 'axios';
import Navbar from '../../components/Navbar';
import { Container } from "react-bootstrap";
import {useState} from "react";
import { useEffect } from "react";
import  styles  from '../../styles/Post.module.css';
import format from 'date-fns/format'
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import CommentList from '../../components/CommentList';
import TagPost from '../../components/TagPost';

export const getStaticPaths = async ()=>{
    try{
        var posts= await Axios.get("http://localhost:3001/posts/getPosts")
        const paths = posts.data.map(post=>{
            return {
                params:{id: post.postID.toString()}
            }        
        });
        
        return{
            paths,
            fallback: false
        }    
    }
    catch(err){
        console.log(err);
        return{
            paths : [],
            fallback: false
        }
    }
}


export const getStaticProps = async (context)=>{
    const id = context.params.id;
    try{
        var post=await Axios.get(`http://localhost:3001/posts/${id}`)
        return{
            props :{post : post.data}
        }
    }catch(err)
    {
        console.log(err);
    }
}


const Details = ({post}) => {
    const [picture,setPicture] = useState("");
    const [price,setPrice]= useState("");
    const [commentList,setCommentList]= useState(post.comments);
    const [comment, setComment] = useState("");

    useEffect(()=>{
        console.log(post);
        getPicture();
    },[])

    const bid =(e)=>{
        e.preventDefault()
        const config = {
            headers : {
                "x-access-token": localStorage.getItem('token'),
            }
        };
        Axios.post("http://localhost:3001/bids/",{
            postID : post.postID,
            price : price
        },config).then((response) =>{
            alert(response.data.message);
        })
        .catch((err)=>{
            alert(err.response.data.message)
        })
    }

    const getPicture = ()=>{
        Axios.get(`http://localhost:3001/posts/getImage/${post.postID}`,{ responseType: 'blob' })
        .then(async (response) =>{
            // console.log(response);
            // setPicture(URL.createObjectURL(response));
            setPicture(URL.createObjectURL(response.data));
        }).catch((err)=>{
            console.log(err);
        })
    }

    const handler = async (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            const config = {
                headers : {
                    "x-access-token": localStorage.getItem('token'),
                }
            };
            try{
                var response = await Axios.post(`http://localhost:3001/comments/${post.postID}`,
                                {content : comment},config);
                setCommentList([...commentList,response.data.newComment[0]]);
                console.log(response);
            }
            catch(err){
                alert(err)
            }
        }
    }

    return (
        <div>
            <Navbar/>
            <Container className={styles.post}>
                    <div className={styles.picture}>
                        <img className={styles.pictureView} src={picture}></img>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.description}>{post.description}</div>
                        <div className={styles.alignRow}>
                            <TagPost tagList={post.tags}/>
                            <div className={styles.priceDate}>
                                <div>Ends at:</div>
                                <div>{format(Date.parse(post.endTIme), 'd.MM.Y H:m')}</div> 
                                <div>Price: ${post.currentPrice}</div>
                            </div>
                            <div className={styles.bid}>
                                <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control type="number" placeholder="How much?" value={price} onChange={(e)=>setPrice(e.target.value)}/>
                                </Form.Group>
                                </Form>
                                <Button variant="danger" size='lg' onClick={bid}>Bid now!</Button>
                            </div>
                        </div>
                    </div>
            </Container>
            <Container className={styles.commentSection}>
                <CommentList commentList={commentList}/>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control 
                        as="textarea" 
                        rows={3} 
                        onChange={(e)=>setComment(e.target.value)}
                        onKeyPress={(e) => handler(e)} />
                    </Form.Group>
                </Form>
            </Container>
        </div>
     );
}
 
export default Details;