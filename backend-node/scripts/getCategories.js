const axios = require('axios');
const BASE_URL = 'http://localhost:3303';

axios.get(`${BASE_URL}/api/business-categories/public/available-categories`)
  .then(r => {
    const cats = r.data.data.filter(c => c.level === 1);
    console.log('一级分类:');
    cats.forEach(c => console.log(`  label: ${c.label}, key: ${c.key}`));
  })
  .catch(e => console.log(e));