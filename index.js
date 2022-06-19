const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const isDebugger = false;

async function snap(url, save_to, save_pdf_to = save_to) {
    const browser = await puppeteer.launch({
        // 无头模式，不打开浏览器显示脚本运行过程，可以在调试过程中打开
        headless: true,
        // 设置浏览器窗口大小
        defaultViewport: {
          width: 1024,
          height: 655,
        }
      });

    const page = await browser.newPage();

    try {
        // 进入登陆页面，并等待直到没有网络连接的时候向下进行
        await page.goto(url, {
          waitUntil: 'networkidle2',
        });
    } catch(e) {
        console.log(`[Error] 错误原因: ${e}`);
        // 关闭浏览器并返回不再向下运行，本次Fetch失败
        await browser.close();
        return;
    }

    page.once('load', () => console.log('Page loaded!'));

    page.waitForTimeout(8000).then(() => console.log('[INFO] Waited 8 second, now let\'s snap and save!')); // 考虑到部分网站JavaScript加载延时

    await page.screenshot({ path: save_to, fullPage: true});

    await page.pdf({
        path: save_pdf_to,
        format: 'a4',
      });
    
    await browser.close();
}

snap('https://www.baidu.com', './snap/baidu.com.png', './pdf/baidu.com.pdf');

snap('https://xzblog.vercel.app/', './snap/xiaozhu2007-blog-vercel.png', './pdf/xiaozhu2007-blog-vercel.pdf');
