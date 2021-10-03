import path from 'path';

const fs = require('fs');

class ElectronProver {
  // eslint-disable-next-line class-methods-use-this
  handleSaveBibleJSON(event, data) {
    console.log(event, JSON.stringify(data));

    fs.writeFile(
      path.join(__dirname, 'bible.json'),
      JSON.stringify(data),
      err => {
        if (err) throw err;
        console.log('Data written to file');
      },
    );
  }
}

export default new ElectronProver();
