const puppeteer = require('puppeteer');
const fs = require("fs");

const isDebugger = false;

async function snap(url, img) {
    const browser = await puppeteer.launch({
        // 无头模式，不打开浏览器显示脚本运行过程，可以在调试过程中打开
        headless: true,
        // 设置浏览器窗口大小
        defaultViewport: {
          width: 1000,
          height: 2000,
        }
      });
    const page = await browser.newPage();
    try {
        // 进入登陆页面，并等待直到没有网络连接的时候向下进行
        await page.goto(url, {
          waitUntil: "networkidle2",
        });
      } catch(e) {
        console.log("页面无法访问！");
        // 关闭浏览器并返回不再向下运行，本次Fetch失败
        await browser.close();
        return;
      }
    // page.once('load', () => console.log('Page loaded!'));
    await page.screenshot({ path: img, fullPage: true});
    await browser.close();
}

snap("https://github.com", "./snap/github.png");
