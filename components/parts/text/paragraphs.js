import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Linkコンポーネントが使用される場合のためにインポートを保持

export default function Paragraphs({ value }) {
    if (!value) {
        return <></>;
    }

    const isArray = Array.isArray(value);
    const [current, setCurrent] = useState(0);
    // valueが配列の場合、value[0]を初期値とし、そうでない場合はvalue自体を初期値とする
    const [renderText, setRenderText] = useState(isArray ? value[0] : value);

    // valueプロパティが変更されたときに、現在の表示をリセットする
    useEffect(() => {
      setCurrent(0); 
      setRenderText(isArray ? value[0] : value); 
    }, [value, isArray]); // isArrayも依存配列に追加

    // 配列の要素数
    let count = isArray ? value.length : 0;

    // 次のテキストへ進む関数
    const addCurrent = () => {
      if (!isArray) { // 配列でない場合は何もしない
        return;
      }
      const added = current + 1;
      if (added >= count) { // 最後のテキストを超えたら何もしない
        return;
      }
      setCurrent(added);
      setRenderText(value[added]);
    };

    // 特定のインデックスのテキストへジャンプする関数
    const changeCurrent = (index) => {
      if (!isArray) { // 配列でない場合は何もしない
        return;
      }
      // インデックスが範囲外の場合は何もしない
      if (index < 0 || index >= count) { 
        return;
      }
      setCurrent(index);
      setRenderText(value[index]);
    };

    // レンダリングするテキストがない場合は何も表示しない
    if (!renderText) {
      return <></>;
    }

    // renderTextが単一のオブジェクトであることを想定
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = renderText;

    // テキスト内容がない場合は何も表示しない
    if (!text || !text.content) {
        return null;
    }

    return (
      <div className="flex flex-col h-full"> {/* 親コンポーネントの高さに合わせて調整 */}
        {/* テキストコンテンツエリア */}
        <div 
          onClick={addCurrent} // クリックで次のテキストへ
          className={[
            bold ? "font-bold" : "",
            code ? "font-mono bg-white/20 p-1 rounded text-white" : "", // コードブロックのスタイル
            italic ? "italic" : "",
            strikethrough ? "line-through" : "",
            underline ? "underline" : "",
            "flex-1 flex items-center justify-center text-md font-light leading-relaxed text-white cursor-pointer" // Flexboxで中央寄せ、テキストスタイル、クリック可能
          ].join(" ")}
          style={{
            ...(color !== "default" ? { color } : {}), // colorが"default"でない場合にcolorプロパティを追加
            whiteSpace: 'pre-line' // whiteSpaceプロパティを追加
          }}
        >
          {text.link ? (
            <a 
              className="text-cyan-400 hover:text-cyan-300 underline hover:no-underline transition duration-300" 
              href={text.link.url} 
              target='_blank' 
              rel="noopener noreferrer" // セキュリティ対策
              onClick={(e) => e.stopPropagation()} // リンククリック時はスライドしないように伝播を停止
            >
              {text.content}
            </a>
          ) : (
            text.content
          )}
        </div>

        {/* ドットナビゲーション */}
        {count > 1 && ( // テキストが複数ある場合のみドットを表示
          <div className='flex flex-row mt-4 h-2 text-center justify-center'>
            {value.map((_, index) => (
              <span 
                key={index} // ドットのキー
                onClick={() => changeCurrent(index)} 
                className={`flex w-2 h-2 mx-1 rounded-full cursor-pointer transition-colors duration-200 
                            ${index === current ? 'bg-cyan-500' : 'bg-white/30 hover:bg-white/50'}`}
              ></span>
            ))}
          </div>
        )}
      </div>
    );
}