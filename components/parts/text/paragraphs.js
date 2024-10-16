import Link from 'next/link';
import React, { useState, useEffect } from 'react';


export default function Paragraphs({ value }) {
    if(!value){
        return <></>
    }
    const [current, setCurrent] = useState(0)
    
    const classname = `flex flex-col mt-4 text-md font-light leading-relaxed text-gray-500 item-center justify-center h-full`

    const isArray = Array.isArray(value);
    const [renderText, setRenderText] = useState(isArray ? value[0] : value)
    useEffect(() => {
      setCurrent(0); 
      setRenderText(value[0]); 
      console.log(value)
    }, [value]); // valueが変わった時に実行
  
    console.log(value)

    let count = 0
    if(isArray){
      count = value.length
    }

    const addCurrent = () => {
      if(!isArray){
        return
      }
      const added = current + 1
      if(added >= count){
        return
      }
      setCurrent(added)
      setRenderText(value[added])
    }

    const changeCurrent = (index) => {
      if(!isArray){
        return
      }
      const added = index
      if(added >= count){
        return
      }
      setCurrent(added)
      setRenderText(value[added])
    }

    if (!renderText) {
      return <></>;
    }

    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = renderText;

    

    const whiteSpaceStyle = isArray ? { whiteSpace: 'pre-wrap', overflowWeap: 'break-word', wordBreak: 'break-all' } : {}
    return (
      <div className={classname} style={whiteSpaceStyle} >
        <div
          onClick={addCurrent}
          className={[
            bold ? "font-bold" : "",
            code ? "font-mono bg-gray-200 p-1 rounded" : "",
            italic ? "italic" : "",
            strikethrough ? "line-through" : "",
            underline ? "underline" : "",
            "flex-1 flex items-center justify-center "
          ].join(" ")}
          style={color !== "default" ? { color } : {}}
          key={text.content}
        >
          {text.link ? <a className="text-black hover:text-blue-500 underline hover:no-underline transition duration-300" href={text.link.url} target='_blank'>{text.content}</a> : text.content}
        </div>
        <div className='flex flex-row h-2 text-center justify-center'>
          {count > 1 && value.map((tx, index) =>{
            return (
              <span onClick={()=> changeCurrent(index)} className={`flex w-2 h-2 me-3 ${index == current ? 'bg-blue-800' : 'bg-gray-200'} rounded-full`}></span>
            )
          })}
        </div>
      </div>
    );
}


// export const Text = ({ value }) => {
//   if (!value) {
//     return null;
//   }
//   const {
//     annotations: { bold, code, color, italic, strikethrough, underline },
//     text,
//   } = value;

//   console.log("------------------")
//   console.log(value)
//     console.log(text)
//     console.log("------------------")
  
//   return (
//     <span
//       className={[
//         bold ? "font-bold" : "",
//         code ? "font-mono bg-gray-200 p-1 rounded" : "",
//         italic ? "italic" : "",
//         strikethrough ? "line-through" : "",
//         underline ? "underline" : "",
//       ].join(" ")}
//       style={color !== "default" ? { color } : {}}
//       key={text.content}
//     >
//       {text.link ? <Link className="text-black hover:text-blue-500 underline hover:no-underline transition duration-300" href={text.link.url}>{text.content}</Link> : text.content}
//     </span>
//   );

// };
