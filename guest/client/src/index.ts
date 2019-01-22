const data = {
  id: 'pb1ubc',
  name: 'aaaaa',
  pages: {
    '5cjr1y': {
      id: '5cjr1y',
      name: '1',
      objs: {
        wuvch8: {
          id: 'wuvch8',
          name: 'text',
          type: 'text',
          attrs: {
            text: 'text'
          },
          rect: {
            x: 471,
            y: 296,
            w: 50,
            h: 20
          },
          style: {
            fontSize: '20px',
            color: '#0ff'
          }
        }
      }
    }
  }
}
const appRoot = document.getElementById('app-root');

appRoot.style.width = 'calc(100vw - 2px)';
appRoot.style.height = 'calc(100vh - 2px)';
appRoot.style.border = '1px solid #000';
appRoot.style.position = 'relative';

const curentPage = data.pages[Object.keys(data.pages)[0]];
Object.keys(curentPage.objs).forEach(key => {
  const obj = curentPage.objs[key];
  if (obj.type === 'text') {
    appenText(obj);
  } else if (obj.type === 'image') {
    appenImg(obj);
  }
})

function appenText(obj) {
  const textEl = document.createElement('span');
  textEl.id = obj.id;
  textEl.innerText = obj.attrs.text;
  textEl.style.position = 'absolute';
  textEl.style.top = obj.rect.x + 'px';
  textEl.style.left = obj.rect.y + 'px';
  textEl.style.border = '1px solid #000';
  textEl.style.width = obj.rect.w + 'px';
  textEl.style.height = obj.rect.h + 'px';
  Object.keys(obj.style).forEach(styleName => {
    textEl.style[styleName] = obj.style[styleName];
  });
  appRoot.appendChild(textEl);
}

function appenImg(obj) {

}