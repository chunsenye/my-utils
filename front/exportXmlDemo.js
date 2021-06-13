import xmlbuilder from 'xmlbuilder';
import FileSaver from 'file-saver';

const xmlObj = {
  root: { a: 1 },
};
const xml = xmlbuilder.create(xmlObj, { encoding: 'utf-8' }).end({ pretty: true });
const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
FileSaver.saveAs(blob, `${fileName}.xml`);
