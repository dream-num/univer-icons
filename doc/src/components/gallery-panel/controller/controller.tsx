import React from 'react';
import { Slider } from 'antd';
import { debounce } from 'lodash-es';
import ColorPicker from './color-picker';

interface IController {
  handleSizeChange: (value: number) => void;
  handleColorChange: (value: string) => void;
  handleSecondColorChange: (value: string) => void;
}
export function Controller(props: IController) {
  const handleSizeChange = debounce(props.handleSizeChange, 500);
  const handleColorChange = debounce(props.handleColorChange, 500);
  const handleSecondColorChange = debounce(props.handleSecondColorChange, 500);
  return (
    <div className="controlPanel">
      <div className="controlContent">
        <div className="titleWrapper">
          <div className="title">尺寸: style.fontSize</div>
        </div>
        <div className="sliderWrapper">
          <Slider
            className={'slider'}
            defaultValue={32}
            onChange={handleSizeChange}
            min={12}
            max={48}
          />
        </div>
        <div className="titleWrapper">
          <div className="title">变色方式: style.color</div>
        </div>
        <ColorPicker
          className={'colorPicker'}
          handleColorChange={handleColorChange}
          defaultColor={'000000'}
        />
        <div className="titleWrapper">
          <div className="title">变色方式: extend.colorChannel1</div>
        </div>
        <ColorPicker
          className={'colorPicker'}
          handleColorChange={handleSecondColorChange}
          defaultColor={'E5E5E5'}

        />
      </div>
    </div>
  );
}
