const express = require('express');
const router = express.Router();
const mushroomDataService = require('../services/mushroomDataService');

router.get('/config', async (req, res) => {
  try {
    const config = mushroomDataService.getConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/config', async (req, res) => {
  try {
    const newConfig = req.body;
    const result = mushroomDataService.updateConfig(newConfig);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/config/reset', async (req, res) => {
  try {
    const result = await mushroomDataService.resetToDefault();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/config/from-history', async (req, res) => {
  try {
    const options = req.body || {};
    const result = await mushroomDataService.configureFromHistory(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { 
      syncType, 
      status, 
      page = 1, 
      limit = 20,
      startDate,
      endDate 
    } = req.query;
    
    const options = {
      syncType: syncType || null,
      status: status || null,
      page: parseInt(page),
      limit: parseInt(limit)
    };
    
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    
    const result = await mushroomDataService.getSyncHistory(options);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/statistics', async (req, res) => {
  try {
    const { syncType } = req.query;
    const result = await mushroomDataService.getSyncStatistics(syncType || null);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/last', async (req, res) => {
  try {
    const { syncType } = req.query;
    const result = await mushroomDataService.getLastSyncInfo(syncType || null);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/execute', async (req, res) => {
  try {
    const result = await mushroomDataService.executeUpdate();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/start', async (req, res) => {
  try {
    const { interval } = req.body;
    mushroomDataService.startScheduledSync(interval);
    res.json({
      success: true,
      message: '定时同步任务已启动',
      interval: interval || mushroomDataService.getConfig().syncInterval
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/stop', async (req, res) => {
  try {
    mushroomDataService.stopScheduledSync();
    res.json({
      success: true,
      message: '定时同步任务已停止'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;