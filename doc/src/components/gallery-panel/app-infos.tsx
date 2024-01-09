import * as allManifest from '@univerjs/icons/esm/manifest';
const excludeList = ['outdate'];
export const APP_LIST = ['single', 'binary', 'other'];
export const APP_GROUP = APP_LIST.map((name) => ({
  appName: name,
  groups: Object.keys(allManifest)
    .filter((item) => {
      const itemLowerCase = item.toLowerCase();
      if (itemLowerCase.search(name) < 0) {
        return false;
      }
      const hasExclude = excludeList.some((excludeItem) => {
        return itemLowerCase.search(excludeItem) >= 0;
      });
      if (hasExclude) return false;
      return true;
    })
    .map((item) => ({
      groupName: item.replace('Manifest', '').replace(name, ''),
      // @ts-ignore
      groupItem: allManifest[item],
    })),
}));
