// Copyright [2021] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//


// @id = ch.banana.it.extension.attestatodonazione.test
// @api = 1.0
// @pubdate = 2021-03-03
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.it.extension.attestatodonazione.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.it.extension.attestatodonazione.js
// @timeout = -1


var texts;

// Register test case to be executed
Test.registerTestCase(new TestAttestatoDonazioni());

// Here we define the class, the name of the class is not important
function TestAttestatoDonazioni() {

}

// This method will be called at the beginning of the test case
TestAttestatoDonazioni.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
TestAttestatoDonazioni.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestAttestatoDonazioni.prototype.init = function() {

}

// This method will be called after every test method is executed
TestAttestatoDonazioni.prototype.cleanup = function() {

}

// Generate the expected (correct) file
TestAttestatoDonazioni.prototype.testExtension = function() {

  //Test file contabilità semplice
  var file = "file:script/../test/testcases/ets_semplice_test_attestato_donazioni.ac2";
  var banDoc = Banana.application.openDocument(file);
  Test.assert(banDoc);

  var userParam = {};
  var texts = {};
  var lang = "it";
  texts = loadTexts(banDoc,lang);

  // Test #1
  Test.logger.addComment("****************************************************************************** TEST #1 ******************************************************************************");
  userParam.costcenter = 'S001,S002,S003,S004';
  userParam.minimumAmount = '1.00';
  userParam.texts = '';
  userParam.useDefaultTexts = false;
  userParam.titleText = texts.title;
  userParam.text1 = texts.multiTransactionText;
  userParam.text2 = '';
  userParam.text3 = '';
  userParam.text4 = '';
  userParam.details = true;
  userParam.signature = '';
  userParam.localityAndDate = '';
  userParam.printLogo = '';
  userParam.signatureImage = '';
  userParam.imageHeight = '';
  userParam.styles = '';
  userParam.printHeaderLogo = false;
  userParam.headerLogoName = 'Logo';
  userParam.fontFamily = '';
  userParam.fontSize = '';
  this.report_test(banDoc, "2021-01-01", "2021-12-31", userParam, lang, "Whole year report");

  // Test #2
  Test.logger.addComment("****************************************************************************** TEST #2 ******************************************************************************");
  userParam.costcenter = '';
  userParam.minimumAmount = '0.00';
  userParam.texts = '';
  userParam.useDefaultTexts = false;
  userParam.titleText = 'Donazioni #<Account>: <Period>';
  userParam.text1 = 'Con la presente attestiamo che **<FirstName> <FamilyName>** ha donato alla nostra associazione **<Currency> <Amount>**.';
  userParam.text2 = 'Periodo delle donazioni: dal <StartDate> al <EndDate>.';
  userParam.text3 = 'Indirizzo: <Address>.';
  userParam.text4 = 'Ringraziamo cordialmente.';
  userParam.details = true;
  userParam.signature = 'Pinco Pallino';
  userParam.localityAndDate = 'Milano, dicembre 2021';
  userParam.printLogo = false;
  userParam.signatureImage = '';
  userParam.imageHeight = '';
  userParam.styles = '';
  userParam.printHeaderLogo = false;
  userParam.headerLogoName = "";
  userParam.fontFamily = '';
  userParam.fontSize = '';
  this.report_test(banDoc, "2021-07-01", "2021-12-31", userParam, lang, "Six months report");
}

//Function that create the report for the test
TestAttestatoDonazioni.prototype.report_test = function(banDoc, startDate, endDate, userParam, lang, reportName) {
  texts = loadTexts(banDoc,lang);
  var accounts = getAccountsToPrint(banDoc, startDate, endDate, userParam);
  var report = createReport(banDoc, startDate, endDate, userParam, accounts, lang, "");
  Test.logger.addReport(reportName, report);
}

