/* eslint-disable class-methods-use-this */
import { app } from 'electron';
import path from 'path';
import { SaveBibleJsonPayload } from './interface';

const fs = require('fs');

class ElectronProver {
  handleBibleShowChapter(event: unknown, payload: SaveBibleJsonPayload): void {
    const { data, nodeEnv } = payload;
    const file =
      nodeEnv === 'production'
        ? path.join(app.getAppPath(), '..', '..', 'bible.json')
        : path.join(__dirname, 'bible.json');

    const fileExist = fs.existsSync(file);

    if (fileExist) {
      fs.writeFile(file, JSON.stringify(data), (err: NodeJS.ErrnoException | null) => {
        if (err) throw err;
      });
    } else {
      fs.writeFile(
        file,
        JSON.stringify(data),
        { flag: 'wx' },
        (err: NodeJS.ErrnoException | null) => {
          if (err) throw err;
        },
      );
    }
  }
}

export default new ElectronProver();
