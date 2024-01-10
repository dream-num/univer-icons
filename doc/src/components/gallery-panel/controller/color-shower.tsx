import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface IColorPicker {
  color: string;
  visible: boolean;
  setVisible: Function;
  onChange: (newColor: string) => void;
}
export default class ColorShower extends React.Component<IColorPicker> {
  private handleClick = (e: any) => {
    e?.nativeEvent.stopImmediatePropagation();
    this.props.setVisible(!this.props.visible);
  };

  private handleChoose = (e: any) => {
    e?.nativeEvent.stopImmediatePropagation();
  };
  componentDidMount() {
    document.addEventListener('click', () => {
      this.props.setVisible(false);
    });
  }

  render = () => {
    const { color, visible } = this.props;

    return (
      <div className="colorShower">
        {!!color ? (
          <div
            className="colorBlock"
            onClick={this.handleClick}
            style={{
              background: color.indexOf('#') === 0 ? color : `#${color}`,
            }}
          ></div>
        ) : (
          <svg
            width="24"
            height="24"
            onClick={this.handleClick}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23 1L1 23" stroke="#F25A6E" />
          </svg>
        )}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '30px',
            display: `${visible ? '' : 'none'}`,
          }}
          onClick={this.handleChoose}
        >
          {/* @ts-ignore */}
          <HexColorPicker
            className="colorPanel"
            color={color}
            onChange={this.props.onChange}
          />
        </div>
      </div>
    );
  };
}
