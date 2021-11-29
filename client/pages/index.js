import styles from '../styles/Home.module.css'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import TagBid from '../components/TagBid'
import { useEffect } from 'react'
import { useState } from 'react'
import Axios from 'axios'
import { Button } from 'react-bootstrap'

export default function Home() {

  useEffect(() => {
    getTaglist();
    getAllPosts();
  }, [])

  const [tagList,setTagList] = useState([]);
  const [postList,setPostList] = useState([]);

  const getTaglist =() =>{
    Axios.get("http://localhost:3001/allTags").then((response =>{
      console.log(response.data);
      setTagList(response.data);
    }));
  }

  const getAllPosts =()=>{
    Axios.get("http://localhost:3001/posts/getPosts").then((response =>{
      console.log(response.data);
      setPostList(response.data);
    }))
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

  return (
    <div>
      <Navbar/>
      <br/>
      <SearchBar searchPost={searchPost}/>
      <TagBid tagList={tagList} postList={postList} onAdd={addTagPost} onRemove={removeTagPost}/>
    </div>
  )
}
