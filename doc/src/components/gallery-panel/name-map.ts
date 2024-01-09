import { extraData } from '../../extra/extra';

interface IMap {
  [key: string]: string;
}

let nameMap: IMap = {
  // some translation or alias
  single: '【可变】单色图标',
  binary: '【可变】多色图标',
  other: '【不可变色】图标',
};

let infosMap: IMap = {};

extraData.forEach((item: any) => {
  nameMap[item.name] = item.translation;
  infosMap[item.name] = item.infos;
});

let lowerMap: IMap = {};
Object.keys(nameMap).forEach((v) => {
  lowerMap[v.toLowerCase()] = nameMap[v];
});
Object.keys(infosMap).forEach((v) => {
  infosMap[v.toLowerCase()] = infosMap[v];
});

const translate = (origin: string, infos: boolean = false) => {
  const lowerText = origin.toLowerCase();
  if (infos) {
    return infosMap[origin] || infosMap[lowerText] || origin || 'error';
  }
  return nameMap[origin] || lowerMap[lowerText] || origin || 'error';
};

export default translate;
