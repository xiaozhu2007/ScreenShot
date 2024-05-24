const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const isDebugger = false;
let dateObject = new Date();
let date = ("0" + dateObject.getDate()).slice(-2);
let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
let year = dateObject.getFullYear();

fs.exists(`./snap/${year}/${month}/${date}`, (exists) => {
  if (!exists) {
    fs.mkdir(`./snap/${year}/${month}/${date}`, { recursive: true }, (err) => { /* Do nothing */ });
  }
});

fs.exists(`./pdf/${year}/${month}/${date}`, (exists) => {
  if (!exists) {
    fs.mkdir(`./pdf/${year}/${month}/${date}`, { recursive: true }, (err) => { /* Do nothing */ });
  }
});

async function snap(url, id) {
    const browser = await puppeteer.launch({
        // 无头模式，不打开浏览器显示脚本运行过程，可以在调试过程中打开
        headless: 'new',
        // 设置浏览器窗口大小
        defaultViewport: {
          width: 1024,
          height: 655,
        }
      });

    const page = await browser.newPage();

    try {
        // 进入页面，并等待直到没有网络连接的时候向下进行
        await page.goto(url, {
          waitUntil: 'networkidle2',
        });
    } catch(e) {
        console.log(`[Error] 错误原因: ${e}`);
        // 关闭浏览器并返回不再向下运行，本次截图失败
        await browser.close();
        return;
    }

    page.once('load', () => console.log('[INFO] 网页加载成功'));

    //page.waitForTimeout(8000).then(() => console.log('[INFO] 已等待 8 秒钟, 开始截图')); // 考虑到部分网站 JavaScript 加载延时

    try {
      await page.screenshot({ path: `./snap/${year}/${month}/${date}/${id}-${dateObject.getHours()}.png`, fullPage: false});
      await page.screenshot({ path: `./snap/${year}/${month}/${date}/${id}-${dateObject.getHours()}-full.png`, fullPage: true});

      await page.pdf({
          path: `./pdf/${year}/${month}/${date}/${id}-${dateObject.getHours()}.pdf`,
          format: 'a4',
        });
    } catch (e) {}
    
    await browser.close();
}

/**
 * 请先阅读以下内容再提交 Pull Request 否则直接关闭!
 * 1. 我的 Pull Request 是为了添加链接
 * 2. 我同意 Github Community Guideline & JSDelivr EULA & Chromium 的许可证(BSD)
 * 3. 我同意将网站内容永久性保存在 IPFS 链上
 * 4. 拒绝反动\暴力\色情\宗教\伦理类信息,支持非首页, 支持但不建议 JavaScript 动态加载
 * 注意：在您更改后, 如果出现反动\暴力\色情\宗教\伦理类信息, 则立刻删除!
 */

// 项目首页
snap('https://github.com/xiaozhu2007/ScreenShot/', 'index');
// 万能百度
snap('https://www.baidu.com', 'baidu');
// 百度热搜榜
snap('https://top.baidu.com/board?tab=realtime', 'baidu-top');
// Google News - US
snap('https://news.google.com/home?hl=en-US&gl=US&ceid=US%3Aen&v2prv=1', 'google-news-us');
// Google News - CN
snap('https://news.google.com/home?hl=zh-CN&gl=CN&ceid=CN:zh-Hans&v2prv=1', 'google-news-cn');
// 朽丘博
snap('https://koxiuqiu.cn/', 'koxiuqiu');
// wling 秘密基地
snap('https://blog.tblstudio.cn/', 'wling');
// Thun888
snap('https://blog.hzchu.top/', 'thun888');
