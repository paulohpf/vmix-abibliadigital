/* eslint-disable class-methods-use-this */
import { app } from 'electron';
import path from 'path';

const fs = require('fs');

class ElectronProver {
  /**
   * Salva o Versiculo para exibição externa em um arquivo JSON
   */
  handleBibleShowChapter(event, data) {
    fs.writeFile(
      process.env.node_env === 'production'
        ? path.join(app.getAppPath(), '..', '..', 'bible.json')
        : path.join(__dirname, 'bible.json'),
      JSON.stringify(data),
      err => {
        if (err) throw err;
        console.log('Data written to file');
      },
    );
  }
}

export default new ElectronProver();
