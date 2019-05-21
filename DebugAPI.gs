/*************************************************************************************
$Description Of This Module:

Utility services for debugging

$Revision History:
Version   Date          Author        Description            Location
1.0.0     2016/12/13    CAI Huaqin    initial version
2.0.0     2016/12/13    CAI Huaqin    hide local variables
2.0.1     2017/01/18    CAI Huaqin    1.split the log enable feature into two APIs, users
                                      can enable/disable console log and debug log separately
                                      2.remove the API "logEnable" and "consoleLog"
                                      3.add timing profile API
                                      4.catetorize the logs
2.0.2    2017/06/24     CAI Huaqin    Move scripts to new library "Lib", add prefix "DebugAPI_ for
                                      all APIs

*************************************************************************************/

var gDebug_ = false;
var gCDebug_ = false;
var gTiming_ = false;

/**
  Enable/Disable the debug feature
  @param {boolean} bConsoleEnable Enable/disable the console log
  @return {void}
*/
function DebugAPI_consolelogEnable( bConsoleEnable )
{
  gCDebug_ = bConsoleEnable;
}

/**
  Enable/Disable the debug feature
  @param {boolean} bDebugEnable Enable/disable the debug log
  @return {void}
*/
function DebugAPI_debuglogEnable( bDebugEnable )
{
  gDebug_ = bDebugEnable;
}

/**
  Enable/Disable the timing debug feature
  @param {boolean} bTimingEnable Enable/disable the timing log
  @return {void}
*/
function DebugAPI_timingLogEnable( bTimingEnable )
{
  gTiming_ = bTimingEnable;
}

/**
 * Print debug log into the logs. Note that this debug API only supports 1 parameter with the string
 *
 * @param {string} str string to be logged, variables can be concated to constant strings.
 * @param {string} [optional] logSeverity: debug, info, warning, error, if omitted, it's "debug
 * @return {void}
 */
function DebugAPI_debugLog( str, logSeverity )
{
  if ( gDebug_ == true )
  {
    if ( logSeverity == "info" )
    {
      Logger.log( "[INFO] "+str );
    }
    else if ( logSeverity == "warning" )
    {
      Logger.log( "[WARN] "+str );
    }
    else if ( logSeverity == "error" )
    {
      Logger.log( "[ERR] "+str );
    }
    else
    {
      Logger.log( "[DEBUG] "+str );
    }
  }
  
  if ( gCDebug_ == true )
  {
    if ( logSeverity == "info" )
    {
      console.info( str );
    }
    else if ( logSeverity == "warning" )
    {
      console.warn( str );
    }
    else if ( logSeverity == "error" )
    {
      console.error( str );
    }
    else
    {
      console.log( str );
    }
  }
}

/**
 * start the measure of the timing
 *
 * @param {string} str string to be logged, optional
 * @return {void}
 */
function DebugAPI_timingStart( str )
{
  if ( gTiming_ )
  {
    if ( gDebug_ )
    {
      Logger.log( "[TIME START] "+str );
    }
    
    if ( gCDebug_ )
    {
      console.time( str );
    }
  }
}

/**
 * stop the measure of the timing
 *
 * @param {string} str string to be logged, optional
 * @return {void}
 */
function DebugAPI_timingStop( str )
{
  if ( gTiming_ )
  {
    if ( gDebug_ )
    {
      Logger.log( "[TIME END] "+str );
    }
    
    if ( gCDebug_ )
    {
      if ( str == undefined ) str = "";
      console.timeEnd( str );
    }
  }
}
