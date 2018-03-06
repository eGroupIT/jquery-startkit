const devConfig = {
  apiUrl: 'cc',
}

const prodConfig = {
  apiUrl: 'testr',
}

export default process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
