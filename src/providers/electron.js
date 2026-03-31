/* eslint-disable class-methods-use-this */
import { app } from 'electron';
import path from 'path';

const fs = require('fs');

class ElectronProver {
  getOutputFile(target, nodeEnv) {
    const fileName = target === 'quickText' ? 'quick-text.json' : 'bible.json';

    return nodeEnv === 'production'
      ? path.join(app.getAppPath(), '..', '..', fileName)
      : path.join(__dirname, fileName);
  }

  isValidPayload(payload) {
    if (!payload || typeof payload !== 'object') return false;

    const { data, target } = payload;

    if (!Array.isArray(data)) return false;
    if (data.length > 5000) return false;
    if (target !== undefined && !['bible', 'quickText'].includes(target)) {
      return false;
    }

    return data.every(item => {
      if (!item || typeof item !== 'object') return false;
      if (typeof item.text !== 'string' || item.text.length > 5000)
        return false;
      if (item.info !== undefined && typeof item.info !== 'string')
        return false;
      if (item.model !== undefined && typeof item.model !== 'string')
        return false;
      return true;
    });
  }

  handleBibleShowChapter(event, { data, nodeEnv, target = 'bible' }) {
    const payload = { data, nodeEnv, target };

    if (!this.isValidPayload(payload)) {
      return;
    }

    const file = this.getOutputFile(target, nodeEnv);

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
