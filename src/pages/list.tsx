
import {useEffect, useState} from 'react'
import axios from 'axios'
const DocsPage = () => {
  const [data,setData] = useState<any>({__html: ''})
  const params = new URL(window.location.href).searchParams
  
  useEffect(() => {
    const url = params.get('page') ? `/api/list?page=${params.get('page')}`:`/api/list`
    axios.get(url).then(res => {
      console.log(res,'res--')
      document.write(res.data)
    })
  },[params])
  return (
    <div>
    
    </div>
  );
};

export default DocsPage;
