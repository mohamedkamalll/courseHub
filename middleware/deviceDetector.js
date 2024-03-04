const DeviceDetector = require('node-device-detector');
const DeviceHelper   = require('node-device-detector/helper');
const ClientHints    = require('node-device-detector/client-hints');
const ipInfo = require("ipinfo")

// Current ip information


const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  // ... all options scroll to Setter/Getter/Options
});

const deviceDetector = async(req,res,next)=>{
    try {
        const clientHints = new ClientHints();
        //console.log(req.headers,"hello")
        const userAgent = req.headers['user-agent'];
        const clientHintData = clientHints.parse(req.headers);
        const result = await  detector.detect(userAgent, clientHintData);
        //console.log(result)
        ipInfo((err, cLoc) => {
          //  console.log(err || cLoc)
        })
        var getClientIp = function(req) {
            var ipAddress = req.connection.remoteAddress;
            return ipAddress
        }
        //console.log(req.connection.remoteAddress,"hello")
        next()    
    } catch (error) {
        next(error)
    }
    
}


module.exports = deviceDetector;