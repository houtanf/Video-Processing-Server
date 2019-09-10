const { parseConfigs }  = require('./Config_Parsing/read_configs');
const { processManager } = require('./Video_Processing/process_manager');
const { initS3 } = require('./Video_Downloading/init_s3');
const { getDownload } = require('./Video_Downloading/retrieve_video');
const { pingRequests } = require('./API_Communications/Retrieve/ping_requests');
const { handleResults } = require('./API_Communications/Send/process_results');
const { readResults, sendResults } = require('./API_Communications/Send/send_results');
const { logFile } = require('./Logging/file_log');

const { dockerConfigs, 
        videoStorage,
        resultsStorage, 
        awsConfig, 
        getUrl, 
        sendUrl, 
        password,
        pingRate,
        logPath } = require('../../manager_config.json');


const algos = parseConfigs(dockerConfigs);

const s3 = initS3(awsConfig);
const downloader = getDownload.bind(null, s3);
const sender = handleResults.bind(null, sendResults, readResults, sendUrl, password);
const logger = logFile.bind(null, logPath);

const processor = processManager(algos, downloader, sender, logger, videoStorage, resultsStorage);


pingRequests(getUrl, processor, pingRate, logger);
