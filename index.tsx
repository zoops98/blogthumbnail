import { createRoot } from 'react-dom/client';
import App from './App';
import thumbnailCss from './style.css?inline';

const host = document.getElementById('thumbnail-workspace');
if (!host) throw new Error('썸네일 작업 영역을 찾을 수 없습니다.');
// 카드뉴스 양식과 썸네일 양식의 스타일을 독립적으로 유지한다.
const shell = host.attachShadow({ mode: 'open' });
const style = document.createElement('style');
style.textContent = thumbnailCss;
const mount = document.createElement('div');
shell.append(style, mount);
createRoot(mount).render(<App />);
