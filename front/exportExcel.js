import FileSaver from 'file-saver';
import XLSX from 'xlsx';

const object = 'DATA_OBJECT';
const array = 'DATA_ARRAY';

const s2ab = (s) => {
  if (s.length > 0) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
  return new ArrayBuffer();
};

const appendSheet = (appendData) => {
  const wookSheet = XLSX.utils.aoa_to_sheet(appendData.excelData);
  XLSX.utils.book_append_sheet(appendData.wookBook, wookSheet, `${appendData.sheetName}`);
};

const loopData = (wookBook, data, type) => {
  data.forEach((item, index) => {
    const sheetName = item.sheetName || `sheet${index + 1}`;
    if (item.sheetData && Array.isArray(item.sheetData)) {
      const appendData = {
        wookBook,
        sheetName: `${sheetName}`,
      };
      type === 'DATA_ARRAY' ? appendData.excelData = item.sheetData
        : appendData.excelData = analysisObj(item.sheetData);
      appendSheet(appendData);
    }
  });
};

const analysisObj = (sheetData) => {
  const excelData = [];
  const header = [];
  const content = [];
  sheetData.forEach((item, index) => {
    for (const key in item) {
      if (key !== undefined) {
        if (index === 0) {
          header.push(key);
          content.push(item[key]);
        } else {
          content.push(item[key]);
        }
      }
    }
    excelData.push(content);
    content.splice(0, content.length);
  });
  excelData.unshift(header);
  header.splice(0, header.length);
  return excelData;
};

const exportExcel = (data) => {
  const fileName = data.fileName || 'excel';
  const fileType = data.fileType || 'xlsx';
  const wopts = {
    bookType: `${fileType}`,
    type: 'binary',
  };
  const wookBook = XLSX.utils.book_new();

  if (data && data.dataArray && Array.isArray(data.dataArray)) {
    loopData(wookBook, data.dataArray, array);
  } else if (data && data.dataObj && Array.isArray(data.dataObj)) {
    loopData(wookBook, data.dataObj, object);
  }
  const wbout = XLSX.write(wookBook, wopts);
  FileSaver.saveAs(new Blob([s2ab(wbout)]), `${fileName}.${fileType}`);
};

export default exportExcel;
