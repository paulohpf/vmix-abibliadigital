import { app, IpcMainEvent } from 'electron';
import path from 'path';
import fs from 'fs';

interface BibleData {
  [key: string]: unknown;
}

interface HandleBibleShowChapterParams {
  data: BibleData;
  nodeEnv: string;
}

/**
 * Salva o Versiculo para exibição externa em um arquivo JSON
 */
export const handleBibleShowChapter = (
  event: IpcMainEvent,
  params: HandleBibleShowChapterParams,
): void => {
  const { data, nodeEnv } = params;
  
  const file =
    nodeEnv === 'production'
      ? path.join(app.getAppPath(), '..', '..', 'bible.json')
      : path.join(__dirname, 'bible.json');

  const fileExist = fs.existsSync(file);

  if (fileExist) {
    fs.writeFile(file, JSON.stringify(data), (err: Error | null) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  } else {
    fs.writeFile(file, JSON.stringify(data), { flag: 'wx' }, (err: Error | null) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  }
};

export default handleBibleShowChapter;
