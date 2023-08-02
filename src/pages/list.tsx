
import {useEffect, useState} from 'react'
import axios from 'axios'
const DocsPage = () => {
  const [data,setData] = useState<any>({__html: ''})
  const params = new URL(window.location.href).searchParams

  useEffect(() => {
    axios.get(`/api/list?page=${params.get('page')}`).then(res => {
      console.log(res.data,'res')
      // setData(res.data)
      document.write(res.data)
    })
  },[params])
  return (
    <div>
    
    </div>
  );
};

export default DocsPage;
