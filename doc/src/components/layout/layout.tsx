import React, { PropsWithChildren } from 'react';
import { Link } from '@reach/router';

import './layout.css';

export function Layout(props: PropsWithChildren<{}>) {
  return (
    <div className="frame">
      <div className="left-panel">
        <div className="sidebar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 220 100">
              <text x="0" y="40%" className="logo-text">
                {' '}
                @univerjs/icons{' '}
              </text>
            </svg>
          </Link>
        </div>
        <div className="sidebar-navigator"></div>
        <div className="sidebar-footer">
          <ul className="footer-menu">
            <li className="menu-item">
              <Link to="/introduction">关于</Link>
            </li>
            <li className="menu-item">
              <Link to="/api">API 文档</Link>
            </li>
          </ul>
          <div className="note">如有任何问题或建议，请联系 yuhong</div>
        </div>
      </div>
      <div className="main">{props.children}</div>
      {/* <div className="tool-panel"></div> */}
    </div>
  );
}
