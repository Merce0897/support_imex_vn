import { Cluster } from "puppeteer-cluster";
import { ElementHandle } from "puppeteer";
import { supabase } from "./supabase";
import fs from "fs";
import https from "https";
import * as path from "path";

type Record = {
  invoice: string;
  exportCompany: string;
  exportDate: string;
  exportCountry: string;
  importGate: string;
  invoiceURL: string;
  safetyURL: string;
  item: {
    cas: {
      id: number;
      value: string;
    }[];
    hs: string;
    name: string;
    content: string;
    weight: string;
    unit: string;
    state: string;
    origin: string;
    danger: string;
    reason: string;
    detail: string;
  }[];
};

export const callCreateNewChemical = async (record: Record) => {
  console.log("NEW RECORD: ", record);
  let res = false,
    error = "";
  // Launch the browser and open a new blank page
  const user = {
    id: "3700337163",
    password: "Uchiyamavn123#",
  };

  const downloadPdf = (url: string, fileName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const tempPath = path.join("/tmp", fileName);
      const file = fs.createWriteStream(tempPath);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close((err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        })
        .on("error", (err) => {
          fs.unlink(tempPath, () => reject(err.message));
        });
    });
  };
  const fileNameInv = record.invoiceURL.split("/")[1];
  const fileNameSft = record.safetyURL.split("/")[1];

  const invURL = supabase.storage
    .from("attachment_chemical")
    .getPublicUrl(record.invoiceURL);

  const sftURL = supabase.storage
    .from("attachment_chemical")
    .getPublicUrl(record.safetyURL);
  await downloadPdf(invURL.data.publicUrl, fileNameInv);
  await downloadPdf(sftURL.data.publicUrl, fileNameSft);

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    puppeteerOptions: {
      headless: true,
      slowMo: 10,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-extensions",
      ],
    },
    timeout: 120000,
  });

  await cluster.task(async ({ page, data: url }) => {
    const addCas = async (cas: { id: number; value: string }) => {
      await page.click(
        "#modal_addProduct > div.modal-body > form > div > div.col-md-4.nsw-text-right > div:nth-child(1) > div.col-md-4 > span"
      );

      await page.click(
        `ul#select2-CASCbx-results li:nth-child(${cas.id.toString()})`
      );
    };
    const addItem = async ({
      cas,
      name,
      hs,
      content,
      weight,
      unit,
      state,
      origin,
      danger,
      reason,
      detail,
    }: {
      cas: {
        id: number;
        value: string;
      }[];
      name: string;
      hs: string;
      content: string;
      weight: string;
      unit: string;
      state: string;
      origin: string;
      danger: string;
      reason: string;
      detail: string;
    }) => {
      console.log("start add ITEM");

      await page.click(
        '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[2]/fieldset/legend/a)'
      );

      for (let c of cas) {
        await addCas(c);
      }

      await page.type(
        "#modal_addProduct > div.modal-body > form > div > div.col-md-8.nsw-text-left > div:nth-child(1) > div:nth-child(2) > input",
        name
      );
      await page.type(
        "#modal_addProduct > div.modal-body > form > div > div.col-md-8.nsw-text-left > div:nth-child(2) > div:nth-child(4) > input",
        hs
      );

      await page.type(
        "#modal_addProduct > div.modal-body > form > div > div.col-md-8.nsw-text-left > div:nth-child(3) > div:nth-child(2) > input",
        content
      );

      await page.type(
        "#modal_addProduct > div.modal-body > form > div > div.col-md-8.nsw-text-left > div:nth-child(3) > div:nth-child(4) > input",
        weight
      );
      await page.click(
        '::-p-xpath(//*[@id="modal_addProduct"]/div[2]/form/div/div[2]/div[4]/div[2]/span[1])'
      );
      await page.click(`ul.select2-results__options li:nth-child(${unit})`);

      await page.click(
        '::-p-xpath(//*[@id="modal_addProduct"]/div[2]/form/div/div[2]/div[4]/div[4]/span[1])'
      );
      await page.click(`ul.select2-results__options li:nth-child(${state})`);

      await page.click(
        '::-p-xpath(//*[@id="modal_addProduct"]/div[2]/form/div/div[2]/div[5]/div[2]/span[1])'
      );
      await page.click(`ul.select2-results__options li:nth-child(${origin})`);

      await Promise.all([
        page.click(
          '::-p-xpath(//*[@id="modal_addProduct"]/div[2]/form/div/div[2]/div[5]/div[4]/span[1])'
        ),
        await page.waitForSelector("::-p-xpath(/html/body/span/span)"),
      ]);
      console.log("dangerrrrrrrr");

      await page.click(`ul.select2-results__options li:nth-child(${danger})`);
      console.log("pass danger");

      await page.click(
        '::-p-xpath(//*[@id="modal_addProduct"]/div[2]/form/div/div[2]/div[6]/div[2]/span[1])'
      );
      console.log("reasonnnnnnnnnnnn");

      await page.click(`ul.select2-results__options li:nth-child(${reason})`);
      console.log("pass reason");

      await page.type(
        "::-p-xpath(/html/body/div[5]/div/div[2]/form/div/div[2]/div[7]/div[2]/input)",
        detail
      );
      console.log("assaeeett");
      await page.screenshot({
        path: "./screenshot.jpg",
      });
      await Promise.all([
        page.click(
          '::-p-xpath(//*[@id="modal_addProduct"]/div[3]/div/button[1])'
        ),
        page.waitForSelector(
          '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[2]/fieldset/form/div/div/table/tbody/tr[1])'
        ),
      ]);
      console.log("end add ITEM");
    };

    try {
      console.log("START SIMULATOR");

      // Navigate to Login Page
      await page.goto(url);

      // Set screen size
      await page.setViewport({ width: 1280, height: 1024 });
      await page.waitForNetworkIdle();
      await page.type("#username", user.id);
      await page.type("#password", user.password);

      await Promise.all([
        page.click("#btnLogin"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      // Access to declare page

      await Promise.all([
        page.goto("https://khaibaohoso.vnsw.gov.vn/moit/14/create"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.click(
        '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/form/div/div/div[2]/span[1])'
      );
      await page.click('li[id^="select2-fiPhongBanQuanLyCbx-result"]');

      await page.type(
        'input[data-bind="value: fiTruSoChinh "]',
        "Số 25, Đường số 06, Khu công nghiệp Việt Nam-Singapore, Phường Bình Hòa, Thành phố Thuận An, Tỉnh Bình Dương, Việt Nam"
      );

      await page.click(
        '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[1]/form/div[2]/div/div[4]/span[1])'
      );
      await page.type("::-p-xpath(/html/body/span/span/span[1]/input)", "b");
      await page.click("ul#select2-cbxTinhThanh-results li:nth-child(5)");

      await page.click(
        '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[1]/form/div[3]/div/div[2]/span[1])'
      );
      await page.click("ul#select2-cbxQuanHuyen-results li:nth-child(6)");

      await page.click(
        '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[1]/form/div[3]/div/div[4]/span[1])'
      );
      await page.click("ul#select2-cbxXaPhuong-results li:nth-child(7)");

      await page.type('input[data-bind="value: fiDienThoai "]', "02743757001");
      await page.type(
        'input[data-bind^="value: fiNguoiDaiDien "]',
        "SATORU TAKATA"
      );

      await page.type('input[data-bind^="value: fiChucVu "]', "TỔNG GIÁM ĐỐC");
      await page.click('input[data-bind="checked: fiSuDung "]');

      await page.type(
        'input[data-bind^="value: fiDiaChiHoatDong "]',
        "Số 25, Đường số 06, Khu công nghiệp Việt Nam-Singapore, Phường Bình Hòa, Thành phố Thuận An, Tỉnh Bình Dương, Việt Nam"
      );

      await page.type(
        'input[data-bind="value: fiNguoiPhuTrach"]',
        "Nguyễn Huỳnh Trúc Nhi"
      );

      await page.type('input[data-bind="value: fiSoDTDT"]', "0389531144");

      // Declare "Số hóa đơn"
      await page.type('input[data-bind*="value: fiSoHoaDon"]', record.invoice);

      // Declare "Công ty xuất khẩu"
      await page.type(
        'input[data-bind*="value: fiCongTyXK "]',
        record.exportCompany
      );

      // Declare "Ngày hóa đơn"
      await page.type(
        'input[data-bind*="datepicker: fiNgayHoaDon "]',
        record.exportDate
      );
      // await page.evaluate("#txt_FromDateText", );
      await page.screenshot({
        path: "./screenshot.jpg",
      });
      await page.click(
        '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[2]/form/div[2]/div/div[4]/span[1])'
      );
      await page.type(
        "body > span > span > span.select2-search.select2-search--dropdown > input",
        "nha"
      );
      await page.click("ul#select2-cbxQuocGia-results li:nth-child(4)");

      await Promise.all([
        await page.click(
          '::-p-xpath(//*[@id="moit14Create"]/div/div/div/div[2]/div/div/div/div/fieldset[2]/form/div[3]/div/div[2]/span[1])'
        ),
        page.waitForSelector("::-p-xpath(/html/body/span/span)"),
      ]);

      await page.click(
        `ul.select2-results__options li:nth-child(${record.importGate.toString()})`
      );

      for (let i of record.item) {
        await addItem(i);
      }

      const inputHD = await page.$("#file-HD");
      if (inputHD) {
        await (inputHD as ElementHandle<HTMLInputElement>).uploadFile(
          fileNameInv
        );
      } else {
        console.error("inputHCAT is null");
      }
      console.log("start input file invoice");

      await page.waitForSelector(
        "#moit14Create > div > div > div > div.portlet-body > div > div > div > div > fieldset:nth-child(2) > form > div:nth-child(5) > div > div.col-md-5.nsw-text-right > table > tbody > tr"
      );

      const inputHCAT = await page.$("#file-HCAT");
      if (inputHCAT) {
        await (inputHCAT as ElementHandle<HTMLInputElement>).uploadFile(
          fileNameSft
        );
      } else {
        console.error("inputHCAT is null");
      }
      console.log("start input file safety");

      await page.waitForSelector(
        "#moit14Create > div > div > div > div.portlet-body > div > div > div > div > fieldset:nth-child(2) > form > div:nth-child(6) > div > div.col-md-5.nsw-text-right > table > tbody > tr"
      );

      await Promise.all([
        page.click(
          "::-p-xpath(/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div/div/div/button[1])"
        ),
        page.waitForSelector("::-p-xpath(/html/body/div[5]/div)"),
      ]);

      const confirm = await page.$(
        "::-p-xpath(/html/body/div[5]/div/div[3]/a[1])"
      );
      console.log("confirm click", confirm);

      await confirm!.evaluate((el) => {
        if (el instanceof HTMLElement) {
          el.click();
        } else {
          console.error("Element is not an HTMLElement");
        }
      });
      console.log("SUCCESS");
      const { data, error } = await supabase.storage
        .from("attachment_chemical")
        .remove([record.invoiceURL, record.safetyURL]);

      fs.unlink(fileNameInv, (err) => console.log(err));
      fs.unlink(fileNameSft, (err) => console.log(err));
      res = true;
    } catch (error) {
      error = error;
      console.log(error);
    }
  });

  await cluster.execute("https://khaibaohoso.vnsw.gov.vn/login");
  // cluster.queue('http://www.wikipedia.org/');
  // many more pages

  await cluster.idle();
  await cluster.close();
  return res ? "success" : `error: ${error}`;
};
