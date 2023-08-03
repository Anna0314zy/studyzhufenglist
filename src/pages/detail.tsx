import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DocsPage = () => {
  const routerParams = useParams<{
    id: string;
  }>();

  const params = new URL(window.location.href).searchParams;
  useEffect(() => {
    const id = routerParams.id;
    const base = `/api/detail?id=${id}`;
    axios.get(base).then((res) => {
      // 获取一部分页面结构
      // document.write(res.data);
      // 请求页面中需要的详情数据
    });
  }, [routerParams.id]);
  return (
    <div>
      <p>This is umi 详情----.</p>
    </div>
  );
};

export default DocsPage;
