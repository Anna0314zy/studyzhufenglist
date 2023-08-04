import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message, Collapse } from 'antd';
import type { CollapseProps } from 'antd';

// const obj: {
//   [key: string]: number;
// } = {
//   '3393': 3397,
//   "3396":3400,
//   "3397":3401,
//   "3402":3406,
//   "3403":3407,
// };
const DocsPage = () => {
  const routerParams = useParams<{
    id: string;
  }>();
  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);

  const params = new URL(window.location.href).searchParams;

  useEffect(() => {
    const id = Number(routerParams.id) +4
    if (!id) return;
    console.log(id, 'id-----');
    const base = `/api/detail?id=${id}`;
    axios.get(base).then((res) => {
      console.log(res.data, 'data--');
      setTitle(res.data.head);
      const data = res.data.data;
      setData(data);
      document.querySelector('.summary')!.innerHTML = res.data.summary;
      //itemType.chapter 距离下一个chapter 中间的数据是上一个chapter的children
      //itemType.section 距离下一个section 中间的数据是上一个section的children
      //平级数据 根据parend
      message.success('success');
      // 获取一部分页面结构
      // document.write(res.data);
      // 请求页面中需要的详情数据
    });
  }, [routerParams.id]);
  const content = (item: any) => {
    switch (item.itemType) {
      case 'chapter':
        return (
          <h4>
            第{item.number}章:{item.title}
          </h4>
        );
        break;
      case 'unit':
        return (
          <p style={{ color: 'gray' }}>
            第{item.number}节: {item.title}
          </p>
        );
        break;
      default:
        return (
          <p style={{ paddingLeft: '20px' }}>
            课时{item.number}: {item.title}---{item.activityLength}
          </p>
        );
    }
  };
  return (
    <div>
      <h2>{title}</h2>

      {data.map((item: any, index: number) => {
        return <div key={index}>{content(item)}</div>;
      })}
      <div className="summary" style={{color:'blue'}}></div>
      {/* <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} /> */}
    </div>
  );
};

export default DocsPage;
