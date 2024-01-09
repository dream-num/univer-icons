import React from 'react';
import { useState } from 'react';
import { message } from 'antd';

interface IIconBox {
  icon: any;
  name?: string;
  nameCn?: string;
  copyName?: string;
  size?: number;
  color?: string | null;
  secondColor?: string | null;
}
export function IconBox(props: IIconBox) {
  const Icon = props.icon;
  const name = props.name;
  const nameCn = props.nameCn;
  let style;
  if (props.color) {
    style = {
      fontSize: `${props.size}px` || '24px',
      color: props.color,
    };
  } else {
    style = {
      fontSize: `${props.size}px` || '24px',
    };
  }
  const copy = (e: any) => {
    e?.nativeEvent.stopImmediatePropagation();
    const text = `<${props.copyName} />`;
    const input: any = document.getElementById('fakeForCopy');

    input.value = text;
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand('copy');

    message.success('已复制到剪切板');
  };
  const [isHover, setHover] = useState(false);

  return (
    <div
      className="boxWrapper"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <div className="iconContainer">
        <div className="iconSource">
          <Icon
            style={style}
            extend={{ colorChannel1: props.secondColor || '#E5E5E5' }}
          />
        </div>
      </div>
      {isHover ? (
        <div className="buttonContainer">
          <button className="copyCode" onClick={copy}>
            复制代码
          </button>
        </div>
      ) : (
        <div className="textContainer">
          <div className="iconName"> {nameCn} </div>
          <div className="iconName-en"> {name} </div>
        </div>
      )}
    </div>
  );
}
