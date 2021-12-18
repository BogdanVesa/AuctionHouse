import styles from '../styles/Auction.module.css'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import TagBid from '../components/TagBid'
import { useEffect } from 'react'
import { useState } from 'react'
import Axios from 'axios'
import { Button } from 'react-bootstrap'
import AuctionList from '../components/AuctionList'
import { Offcanvas } from 'react-bootstrap'
import TagList from '../components/TagList'
import { Justify } from 'react-bootstrap-icons';


export default function Home() {

  const [width, setWidth]   = useState("");
  const [height, setHeight] = useState("");
  const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    getTaglist();
    getAllPosts();
    setWidth(window.innerWidth);
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [])

  const [tagList,setTagList] = useState([]);
  const [postList,setPostList] = useState([]);

  const getTaglist =() =>{
    Axios.get("http://localhost:3001/allTags").then((response =>{
      console.log(response.data);
      setTagList(response.data);
    })).catch((err)=>{
      console.log(err);
    });
  }

  const getAllPosts =()=>{
    Axios.get("http://localhost:3001/posts/getPosts").then((response =>{
      console.log(response.data);
      setPostList(response.data);
    })).catch((err)=>{
      console.log(err)
    })
  }

  const [addTag, setAddTag] = useState([]);

  const addTagPost =(name)=>{
    if(!addTag.includes(name))
        setAddTag([...addTag, name]);
  }

  const removeTagPost=(name)=>{
      if(addTag.includes(name))
      {
          const addTagCopy = [...addTag];
          setAddTag(addTag.filter((t) => {
              return  t !== name
          }))
      }
  }

  const searchPost =(name)=>{
    Axios.get("http://localhost:3001/posts/getPosts",{params : {
      description : name,
      tags : addTag
    }}).then((response =>{
      console.log(response.data)
      setPostList(response.data)
    }))
  }

  const searchPostSm =(name)=>{
    Axios.get("http://localhost:3001/posts/getPosts",{params : {
      description : name,
      tags : addTag
    }}).then((response =>{
      console.log(response.data)
      setPostList(response.data)
      setAddTag([])
    }))
  }


  if(width>1000){
  return (
    <div>
      <Navbar/>
      <br/>
      <SearchBar searchPost={searchPost}/>
      <TagBid tagList={tagList} postList={postList} onAdd={addTagPost} onRemove={removeTagPost}/>
    </div>
  )
  }
  else{
    return(
      <div>
        <Navbar></Navbar>
        <br/>
        <SearchBar searchPost={searchPostSm}/>
        <br/>

        <Offcanvas className={styles.canvas} show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Tags</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body variant='secondary'>
            <TagList tagList={tagList} onAdd={addTagPost} onRemove={removeTagPost} />
          </Offcanvas.Body>
        </Offcanvas>
        <div className={styles.auctionListSm}>
        <Button variant="primary" onClick={handleShow}>
          Tags <Justify/>
        </Button>
        <AuctionList postList={postList}/>
        </div>
      </div>
    )
  }
}
