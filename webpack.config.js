const path = require('path');

module.exports = {
  entry: './src/index.js',  // Asegúrate de que tienes este archivo como punto de entrada
  output: {
    path: path.resolve(__dirname, 'public'),  // Directorio de salida
    filename: 'bundle.js',  // Nombre del archivo de salida
  },
  mode: 'development',  // O 'production' según el entorno
};
