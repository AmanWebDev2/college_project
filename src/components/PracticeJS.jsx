import { createContext, useContext, useEffect, useState } from 'react'
// import Code from '../Code_Editor/Code';
import Data from '../Code_Editor/Data';
import Result from '../Code_Editor/Result';
import { addFileName, createCode, getAllCodes, saveCode } from '../config/firebase';
import { Button } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../Context/User';
import File from '../Code_Editor/File';
// import DataProvider from '../Context/DataProvider'
import SendIcon from '@mui/icons-material/Send';

export const EditorContext = createContext(null);

function PracticeJS() {
  const { html, css, js, setHtml, setCss, setJs } = useContext(EditorContext);
  const [files, setFiles] = useState([]);
  const params = useParams();
  const { user, setUser } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      const data = await getAllCodes();
      setFiles(data);
    })()
  }, []);

  useEffect(() => {
    files.forEach((file) => {
      if (file.id === params.id) {
        setHtml(file.html);
        setCss(file.css);
        setJs(file.js);
      }
    })
  }, [files, params]);

    
  const handleEditFileName = async () => {
    const name = prompt('Enter new file name');
    const id = params.id;
    if (name && id) {
      const res = await addFileName(id,name);
      console.log('id', res)
      // const data = await getAllCodes();
      // setUser({
      //   ...user,
      //   currentFile: data[data.length - 1],
      //   files: data,
      // })
      // navigate(`/playground/${id}`);
    }
  }

    
  const handleSave = async () => {
    //  only update the existing file
    if (params.id) {
      await saveCode(html, css, js, params.id);
    } else {
      // create a new file
      const id = await createCode(html, css, js);
      const data = await getAllCodes();
      setUser({
        ...user,
        currentFile: data[data.length - 1],
        files: data,
      })
      navigate(`/playground/${id}`);
    }
  }
  return (
    <div className='flex container mx-auto p-4 gap-2'>
      <aside className='p-4 border  flex flex-col gap-1 min-w-44 items-center'>
      <div className="save-new flex flex-wrap gap-3 my-3">
        <Button onClick={handleSave} size='small' variant='outlined'>
          Save
        </Button>
        <Button 
         onClick={() => {
          setUser({
            ...user,
            currentFile: null
          })
          setHtml('');
          setCss('');
          setJs('');

          navigate('/playground')
        }}
        
        size='small' variant='outlined'>
          New
        </Button>
      </div>
      {
        user?.userDetail && files.map((file) => {
          return (
            <Link className='w-full' to={`/playground/${file.fileName}`}>
              <div className='border flex justify-between gap-3 px-3 py-2 rounded-lg'>
                <span>
                {/* {file.fileName ?? file.id} */}
                {
                  file.fileName ? (
                    file.fileName.length > 7 ? file.fileName.slice(0,7) + '...'  : file.fileName
                  ): (
                    file.id.length> 7 ? file.id.slice(0,7) + '...' : file.id
                  )
                }
                </span>
                <span className='' onClick={handleEditFileName}>
                <SendIcon />
                </span>
              </div>
              {/* <Button endIcon={<SendIcon />} fullWidth size='small' variant='outlined' className='bg-red-400' key={file.id}>
              </Button> */}
            </Link>
          )
        })
      }
      </aside>
      <main className='flex-1'>


      <Data />
      <Result />
      </main>

      {/* </DataProvider> */}
    </div>

  )
}

export default PracticeJS
