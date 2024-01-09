import React from 'react';
import './index.css';
import * as AllIcons from '@univerjs/icons/esm/icons';
import { IconBox } from './icon-box';
import GroupBlock from './group-block';
import SearchInput from './search-input';
import translate from './name-map';
import { Controller } from './controller/controller';
import SideMenu from './side-menu/side-menu';
import { RefObject } from 'react';
import { APP_GROUP, APP_LIST } from './app-infos';

export default class GalleryPanel extends React.Component {
  state: {
    filteredAppGroups: any[];
    size: number;
    color: string | null;
    secondColor: string | null;
  };

  private search: RefObject<React.Component>;
  constructor(props: any) {
    super(props);

    this.state = {
      filteredAppGroups: this.filterGroupsByName(''),
      size: 24,
      color: null,
      secondColor: null,
    };
    this.search = React.createRef();
  }

  private filterGroupsByName(name: string) {
    const lowName = name.toLowerCase();
    return APP_GROUP.map((appGroupItem) => {
      let filteredGroups = [];
      let appGroup = appGroupItem.groups;
      for (let i = 0; i < appGroup.length; i++) {
        // @ts-ignore
        let items = appGroup[i].groupItem.filter(({ stem, icon }) => {
          // @ts-ignore
          return (
            icon.toLowerCase().search(lowName) >= 0 ||
            translate(stem).search(lowName) >= 0
          );
        });
        if (items.length > 0) {
          filteredGroups.push({
            appName: appGroupItem.appName,
            groupName: appGroup[i].groupName,
            groupItems: items,
          });
        }
      }
      return filteredGroups;
    });
  }

  private handleSizeChange(value: number) {
    this.setState({
      size: value,
    });
  }
  private handleChange(value: string) {
    this.setState({
      filteredAppGroups: this.filterGroupsByName(value),
    });
  }
  private handleColorChange(value: string) {
    this.setState({
      color: value,
    });
  }
  private handleSecondColorChange(value: string) {
    this.setState({
      secondColor: value,
    });
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(e: KeyboardEvent) {}

  render() {
    const { filteredAppGroups, size, color, secondColor } = this.state;
    return (
      <div>
        <div className="siderbar-menu">
          <SideMenu />
        </div>
        <SearchInput
          handleChange={this.handleChange.bind(this)}
          ref={(e: any) => {
            this.search = e;
          }}
        />
        <div className="block-container">
          {filteredAppGroups.map((filteredGroups, index) => (
            <>
              <div className="appTitle" id={APP_LIST[index]}>
                {' '}
                {translate(APP_LIST[index])}{' '}
              </div>
              <div
                id={`${APP_LIST[index]}${filteredGroups.groupName}`}
                key={APP_LIST[index]}
                className="block-list"
              >
                {filteredGroups.map(
                  // @ts-ignore
                  ({ appName, groupName, groupItems }, index) => (
                    <GroupBlock
                      key={`gb_${index}`}
                      appName={appName}
                      groupName={groupName}
                    >
                      {groupItems.map(
                        // @ts-ignore
                        ({ stem, icon }, i) => {
                          // @ts-ignore
                          const Icon = AllIcons[icon];
                          return (
                            <IconBox
                              key={`icon_${i}`}
                              icon={Icon}
                              copyName={icon}
                              name={stem}
                              nameCn={translate(stem)}
                              size={size}
                              color={color}
                              secondColor={secondColor}
                            />
                          );
                        }
                      )}
                    </GroupBlock>
                  )
                )}
              </div>
            </>
          ))}
        </div>

        <Controller
          handleSizeChange={this.handleSizeChange.bind(this)}
          handleColorChange={this.handleColorChange.bind(this)}
          handleSecondColorChange={this.handleSecondColorChange.bind(this)}
        />
        <input id="fakeForCopy"></input>
      </div>
    );
  }
}
