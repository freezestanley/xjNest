import { Injectable } from '@nestjs/common';
import { join } from 'path';
// import shell from 'any-shell-escape';
import { exec } from 'child_process';
// import puppeteer from 'puppeteer';
import * as puppeteer from 'puppeteer';
import { launch, getStream } from 'puppeteer-stream';
import * as fs from 'fs';
// import Buffer from 'Buffer';
// const {join} = require('path')
// const shell = require('any-shell-escape')
// const {exec} = require('child_process')

@Injectable()
export class AppService {
  browser: any;
  page: any;
  getHello(): string {
    return 'Hello World!';
  }
  getFFmpeg(): string {
    const url = `ffmpeg -i ${join(process.cwd(), 'b.mov')} -b 1.5M ${join(
      process.cwd(),
      'output.mp4',
    )}`;
    exec(url, (error, stdout, stderr) => {
      console.log(error);
    });
    return 'ffmpeg';
  }
  getMp4(): string {
    // ffmpeg - f image2 - i / home / ttwang / images / image % d.jpg - vcodec libx264 - r 10  tt.mp4
    // const url = `ffmpeg -i ${join(process.cwd(), 'b.mov')} -b 1.5M ${join(
    //   process.cwd(),
    //   'output.mp4',
    // )}`;
    const url = `ffmpeg -f image2 -i ${join(
      process.cwd(),
      './imgs/image%d.jpg',
    )} -vcodec libx264 -r  ${join(process.cwd(), './video/tt.mp4')}`;

    exec(url, (error, stdout, stderr) => {
      console.log(error);
    });
    return 'aaa';
  }
  getAvi(): string {
    const tracing = JSON.parse(
      fs.readFileSync(join(process.cwd(), './trace/trace.json'), 'utf8'),
    );
    const traceScreenshots = tracing.traceEvents.filter(
      (x: any, index: number) =>
        x.cat === 'disabled-by-default-devtools.screenshot' &&
        x.name === 'Screenshot' &&
        typeof x.args !== 'undefined' &&
        typeof x.args.snapshot !== 'undefined',
    );
    traceScreenshots.map((ele, idx) => {
      const dataBuffer = Buffer.from(ele.args.snapshot, 'base64');
      fs.writeFileSync(
        join(process.cwd(), './imgs', `image${idx}.jpg`),
        dataBuffer,
      );
    });
    return 'aa';
  }
  // async getPuppeteer(): Promise<string> {
  //   return await puppeteer.launch().then(async (browser) => {
  //     const page = await browser.newPage();
  //     await page.tracing.start({
  //       path: './trace/trace.json',
  //       screenshots: true,
  //       categories: ['snapshot'],
  //     });
  //     await page.goto('http://localhost:8000/preview?id=1', {
  //       timeout: 0,
  //     });
  //     console.log('start');
  //     setTimeout(async () => {
  //       await page.tracing.stop();
  //       await page.screenshot({
  //         path: join(process.cwd(), './shot/screenshot.png'),
  //         type: 'png',
  //         fullPage: true,
  //       });
  //       await browser.close();
  //       console.log('done');
  //     }, 300000);
  //     return join(process.cwd(), './shot/screenshot.png');
  //   });
  // }
  async getPuppeteer(): Promise<string> {
    const width = 1920,
      height = 1080;
    const browser = await launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--window-size=${width},${height}`,
        '--autoplay-policy=no-user-gesture-required',
        // '--remote-debugging-port=3333',
        // "--auto-open-devtools-for-tabs",
      ],
      defaultViewport: {
        width: 0,
        height: 0,
      },
      ignoreDefaultArgs: ['--disable-extensions'], // '--mute-audio'
    });

    const [page] = await browser.pages();
    const Page = page;
    await page.goto('http://localhost:8000/preview?id=1', {
      // waitUntil: 'networkidle0',
      timeout: 0,
    });

    const stream = await getStream(Page, {
      audio: true,
      video: true,
      frameSize: 20,
    });
    const file = fs.createWriteStream(`${join(process.cwd())}/video/aa.mp4`);
    stream.pipe(file);

    return 'ff';
  }
}
