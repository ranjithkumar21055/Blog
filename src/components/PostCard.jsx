import React from 'react'
import appWriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage}) {
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                <img src={appWriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl w-full h-60 object-cover' />
            </div>
            <h2 className='text-xl font-bold text-black'>
                {title}
            </h2>
        </div>
    </Link>
)
}

export default PostCard