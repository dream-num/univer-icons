import React, { useState } from 'react';
import { Anchor } from 'antd';
import './side-menu.css';
import { APP_GROUP } from '../app-infos';
import translate from '../name-map';

const { Link } = Anchor;

export default function SideMenu() {
  let flatList = [] as any[];

  console.error(flatList);
  return (
    <Anchor
      className="sideMenu"
      items={APP_GROUP.map((appGroupItem) => ({
        key: appGroupItem.appName,
        title: translate(appGroupItem.appName),
        href: `#${appGroupItem.appName}`,
        children: appGroupItem.groups.map((group) => ({
          key: group.groupName,
          title: group.groupName,
          href: `#${appGroupItem.appName + group.groupName}`,
        })),
      }))}
    >
      {flatList.map((g, index) => (
        <div key={index}>
          <Link
            key={index}
            className="groupTitle"
            href={`#${g.appName + g.groupName}`}
            title={`${g.appName} / ${g.groupName}`}
          />
        </div>
      ))}
    </Anchor>
  );
}
