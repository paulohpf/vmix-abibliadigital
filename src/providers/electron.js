/* eslint-disable class-methods-use-this */
import { app } from 'electron';
import path from 'path';

const fs = require('fs');

class ElectronProver {
  isValidPayload(payload) {
    if (!payload || typeof payload !== 'object') return false;

    const { data } = payload;

    if (!Array.isArray(data)) return false;
    if (data.length > 5000) return false;

    return data.every(item => {
      if (!item || typeof item !== 'object') return false;
      if (typeof item.text !== 'string' || item.text.length > 5000) return false;
      if (item.info !== undefined && typeof item.info !== 'string') return false;
      return true;
    });
  }

  handleBibleShowChapter(event, { data, nodeEnv }) {
    const payload = { data, nodeEnv };

    if (!this.isValidPayload(payload)) {
      return;
    }

    const file =
      nodeEnv === 'production'
        ? path.join(app.getAppPath(), '..', '..', 'bible.json')
        : path.join(__dirname, 'bible.json');

    const fileExist = fs.existsSync(file);

    if (fileExist) {
      fs.writeFile(file, JSON.stringify(data), err => {
        if (err) throw err;
      });
    } else {
      fs.writeFile(file, JSON.stringify(data), { flag: 'wx' }, err => {
        if (err) throw err;
      });
    }
  }
}

export default new ElectronProver();
