
import {useEffect, useState} from 'react'
import axios from 'axios'


const DocsPage = () => {
  const params = new URL(window.location.href).searchParams
  useEffect(() => {
    axios.get(`/api/detail`).then(res => {
      console.log(res.data,'res')
      // setData(res.data)
      document.write(res.data)
    })
  },[params])
  return (
    <div>
      <p>This is umi 详情.</p>
    </div>
  );
};

export default DocsPage;
