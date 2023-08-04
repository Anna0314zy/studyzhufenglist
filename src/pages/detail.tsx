import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {message,Collapse} from 'antd'
import type { CollapseProps } from 'antd';

const obj:{
  [key:string]:number
} = {
  '3393':3397
}
const DocsPage = () => {
  const routerParams = useParams<{
    id: string;
  }>();
  const [title, setTitle] = useState('');
  const [data,setData] = useState('')

  const params = new URL(window.location.href).searchParams;

  useEffect(() => {
    const id = routerParams.id as string;
    if(!id) return;
    console.log(id,'id-----')
    const base = `/api/detail?id=${obj[id]}`;
    axios.get(base).then((res) => {
      console.log(res.data,'data--')
      setTitle(res.data.head)
      const data = res.data.data
      //itemType.chapter 距离下一个chapter 中间的数据是上一个chapter的children
      //itemType.section 距离下一个section 中间的数据是上一个section的children
      //平级数据 根据parend
      message.success('success')
      // 获取一部分页面结构
      // document.write(res.data);
      // 请求页面中需要的详情数据
    });
  }, [routerParams.id]);
  return (
    <div>
      <h2>{title}</h2>
      {/* <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} /> */}
    </div>
  );
};

export default DocsPage;
