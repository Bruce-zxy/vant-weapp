import { isDef, isNumber, isPlainObject, isPromise } from './validator';
import { canIUseGroupSetData } from './version';

export function range(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function nextTick(fn: Function) {
  setTimeout(() => {
    fn();
  }, 1000 / 30);
}

let systemInfo: WechatMiniprogram.GetSystemInfoSyncResult;
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = wx.getSystemInfoSync();
  }

  return systemInfo;
}

export function addUnit(value?: string | number): string | undefined {
  if (!isDef(value)) {
    return undefined;
  }

  value = String(value);
  return isNumber(value) ? `${value}px` : value;
}

export function requestAnimationFrame(cb: Function) {
  const systemInfo = getSystemInfoSync();

  if (systemInfo.platform === 'devtools') {
    return nextTick(cb);
  }

  return wx
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(() => {
      cb();
    });
}

export function pickExclude(obj: unknown, keys: string[]) {
  if (!isPlainObject(obj)) {
    return {};
  }

  return Object.keys(obj).reduce((prev, key) => {
    if (!keys.includes(key)) {
      prev[key] = obj[key];
    }

    return prev;
  }, {});
}

export function getRect(
  context: WechatMiniprogram.Component.TrivialInstance,
  selector: string
) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult>(
    (resolve) => {
      wx.createSelectorQuery()
        .in(context)
        .select(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]));
    }
  );
}

export function getAllRect(
  context: WechatMiniprogram.Component.TrivialInstance,
  selector: string
) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult[]>(
    (resolve) => {
      wx.createSelectorQuery()
        .in(context)
        .selectAll(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]));
    }
  );
}

export function groupSetData(
  context: WechatMiniprogram.Component.TrivialInstance,
  cb: () => void
) {
  if (canIUseGroupSetData()) {
    context.groupSetData(cb);
  } else {
    cb();
  }
}

export function toPromise(promiseLike: Promise<unknown> | unknown) {
  if (isPromise(promiseLike)) {
    return promiseLike;
  }

  return Promise.resolve(promiseLike);
}
