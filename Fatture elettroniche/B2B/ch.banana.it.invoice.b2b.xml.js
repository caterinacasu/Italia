// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.it.invoice.b2b.xml
// @api = 1.0
// @pubdate = 2018-10-03
// @publisher = Banana.ch SA
// @description = [BETA] Fattura elettronica...
// @description.it = [BETA] Fattura elettronica...
// @doctype = *
// @includejs = efattura.js
// @includejs = ch.banana.it.invoice.it05.js
// @task = app.command
// @inputdatasource = none
// @timeout = -1


function exec(inData, options) {
   if (!Banana.document) {
      return "@Cancel";
   }

   var eFattura = new EFattura(Banana.document);
   if (!eFattura.verifyBananaVersion())
      return "@Cancel";

   var param = {};
   if (inData.length > 0) {
      param = JSON.parse(inData);
   }
   else if (options && options.useLastSettings) {
      param = JSON.parse(Banana.document.getScriptSettings());
   }
   else {
      if (!settingsDialog())
         return "@Cancel";
      param = JSON.parse(Banana.document.getScriptSettings());
   }

   param = verifyParamInvoiceB2B(param);
   
   var jsonInvoiceList = [];
   if (param.selection == 0 && param.selection_invoice.length > 0)
      jsonInvoiceList = getInvoiceJson(param.selection_invoice, "");
   else if (param.selection == 1 && param.selection_customer.length > 0)
      jsonInvoiceList = getInvoiceJson("", param.selection_customer);

   if (param.output == 0) {
      printPreview(jsonInvoiceList, param);
   }
   else {
      printXml(jsonInvoiceList, param);
   }
}

/*Update script's parameters*/
function settingsDialog() {
   var param = initParamInvoiceB2B();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam.length > 0) {
      param = JSON.parse(savedParam);
   }
   verifyParamInvoiceB2B(param);

   var dialog = Banana.Ui.createUi("ch.banana.it.invoice.b2b.xml.dialog.ui");
   var numeroFatturaRadioButton = dialog.tabWidget.findChild('numeroFatturaRadioButton');
   var clienteRadioButton = dialog.tabWidget.findChild('clienteRadioButton');
   var numeroFatturaLineEdit = dialog.tabWidget.findChild('numeroFatturaLineEdit');
   var clienteComboBox = dialog.tabWidget.findChild('clienteComboBox');
   var stampaPDFRadioButton = dialog.tabWidget.findChild('stampaPDFRadioButton');
   var stampaXmlRadioButton = dialog.tabWidget.findChild('stampaXmlRadioButton');
   var apriXmlCheckBox = dialog.tabWidget.findChild('apriXmlCheckBox');

   var printHeaderCheckBox = dialog.tabWidget.findChild('printHeaderCheckBox');
   var printLogoCheckBox = dialog.tabWidget.findChild('printLogoCheckBox');
   var fontTypeLineEdit = dialog.tabWidget.findChild('fontTypeLineEdit');
   var bgColorLineEdit = dialog.tabWidget.findChild('bgColorLineEdit');
   var textColorLineEdit = dialog.tabWidget.findChild('textColorLineEdit');

   var numeroProgressivoLineEdit = dialog.tabWidget.findChild('numeroProgressivoLineEdit');


   //Lettura dati
   var elencoClienti = getCustomers();
   clienteComboBox.currentText = param.selection_customer;
   clienteComboBox.addItems(elencoClienti);

   if (param.selection == 1)
      clienteRadioButton.checked = true;
   else
      numeroFatturaRadioButton.checked = true;

   var selectedRow = parseInt(Banana.document.cursor.rowNr);
   var noFattura = '';
   if (Banana.document.table('Transactions') && Banana.document.table('Transactions').rowCount > selectedRow) {
      var noFattura = Banana.document.table('Transactions').value(selectedRow, "DocInvoice");
   }
   numeroFatturaLineEdit.text = noFattura;
   if (noFattura.length <= 0)
      numeroFatturaLineEdit.text = param.selection_invoice;

   numeroProgressivoLineEdit.text = param.progressive || '0';

   if (param.output == 1)
      stampaXmlRadioButton.checked = true;
   else
      stampaPDFRadioButton.checked = true;

   apriXmlCheckBox.checked = param.open_xml;
   printHeaderCheckBox.checked = param.print_header;
   printLogoCheckBox.checked = param.print_logo;
   fontTypeLineEdit.text = param.font_family;
   bgColorLineEdit.text = param.color_1;
   textColorLineEdit.text = param.color_2;

   dialog.checkdata = function () {
      dialog.accept();
   }
   dialog.enableButtons = function () {
      if (numeroFatturaRadioButton.checked) {
         numeroFatturaLineEdit.enabled = true;
         clienteComboBox.enabled = false;
      }
      else {
         numeroFatturaLineEdit.enabled = false;
         clienteComboBox.enabled = true;
      }
   }
   dialog.showHelp = function () {
      Banana.Ui.showHelp("ch.banana.it.invoice.b2b.xml.dialog.ui");
   }
   dialog.buttonBox.accepted.connect(dialog, dialog.checkdata);
   dialog.buttonBox.helpRequested.connect(dialog, dialog.showHelp);
   numeroFatturaRadioButton.clicked.connect(dialog.enableButtons);
   clienteRadioButton.clicked.connect(dialog.enableButtons);

   //Visualizzazione dialogo
   Banana.application.progressBar.pause();
   dialog.enableButtons();
   var dlgResult = dialog.exec();
   Banana.application.progressBar.resume();
   if (dlgResult !== 1)
      return false;

   //Salvataggio dati
   param.selection_invoice = numeroFatturaLineEdit.text;
   param.selection_customer = clienteComboBox.currentText;
   if (clienteRadioButton.checked)
      param.selection = 1;
   else
      param.selection = 0;
   if (stampaXmlRadioButton.checked)
      param.output = 1;
   else
      param.output = 0;

   param.open_xml = apriXmlCheckBox.checked;
   param.print_header = printHeaderCheckBox.checked;
   param.print_logo = printLogoCheckBox.checked;
   param.font_family = fontTypeLineEdit.text;
   param.color_1 = bgColorLineEdit.text;
   param.color_2 = textColorLineEdit.text;

   param.progressive = parseInt(numeroProgressivoLineEdit.text);
   var paramToString = JSON.stringify(param);
   Banana.document.setScriptSettings(paramToString);
   return true;
}

getCustomers = function () {
   var customersList = [];
   var journal = Banana.document.invoicesCustomers();
   for (var i = 0; i < journal.rowCount; i++) {
      var tRow = journal.row(i);
      if (tRow.value('ObjectType') === 'InvoiceDocument') {
         var customerId = JSON.parse(tRow.value('CounterpartyId'));
         if (customersList.indexOf(customerId) < 0)
            customersList.push(customerId);
      }
   }
   var tableAccounts = Banana.document.table('Accounts');
   if (tableAccounts) {
      for (var i = 0; i < customersList.count; i++) {
         var row = tableAccounts.findRowByValue('Account', customersList[i]);
         if (row >= 0)
            customersList[i] = customersList[i] + ' ' + tableAccounts.value(row, "Description");
      }
   }
   return customersList;
}

getInvoiceJson = function (invoiceNumber, customerNumber) {
   if (invoiceNumber.length <= 0 && customerNumber.length <= 0)
      return {};

   var journal = Banana.document.invoicesCustomers();
   var jsonInvoiceList = [];

   for (var i = 0; i < journal.rowCount; i++) {
      var tRow = journal.row(i);
      if (tRow.value('ObjectJSonData') && tRow.value('ObjectType') === 'InvoiceDocument') {
         var jsonData = {};
         jsonData = JSON.parse(tRow.value('ObjectJSonData'));
         if (invoiceNumber.length > 0 && jsonData.InvoiceDocument.document_info.number === invoiceNumber) {
            jsonInvoiceList.push(jsonData.InvoiceDocument);
         }
         else if (customerNumber.length > 0 && jsonData.InvoiceDocument.customer_info.number === customerNumber) {
            jsonInvoiceList.push(jsonData.InvoiceDocument);
         }
      }
   }

   return jsonInvoiceList;
}

function initParamInvoiceB2B() {
   var param = initParam();
   /*output 0=pdf, 1=xml*/
   param.output = 0;
   param.open_xml = false;
   /*numero progressivo invio xml*/
   param.progressive = 0;
   /*selection 0=fattura, 1=cliente*/
   param.selection = 0;
   param.selection_invoice = '';
   param.selection_customer = '';
   return param;
}

printPreview = function (jsonInvoiceList, param) {
   var docs = [];
   var styles = [];
   for (var i = 0; i < jsonInvoiceList.length; i++) {
      var jsonInvoice = jsonInvoiceList[i];
      //Banana.console.debug(JSON.stringify(jsonInvoice))
      if (jsonInvoice.billing_info) {
         var repDocObj = Banana.Report.newReport('');
         var repStyleObj = Banana.Report.newStyleSheet();
         repStyleObj.addStyle("@page").setAttribute("margin", "0");
         setInvoiceStyle(repDocObj, repStyleObj, param);
         printInvoice(jsonInvoice, repDocObj, param, repStyleObj);
         docs.push(repDocObj);
         styles.push(repStyleObj);
      }
   }
   if (docs.length) {
      Banana.Report.preview("", docs, styles);
   }
   else {
      Banana.document.addMessage("Fattura non creata. Si prega di controllare se i conti appartengono al gruppo clienti")
   }
}

printXml = function (jsonInvoiceList, param) {

   var eFattura = new EFattura(Banana.document);
   eFattura.initDatiContribuente();
   if (!eFattura.datiContribuente)
      return;
   var xmlDocument = Banana.Xml.newDocument("root");
   
   for (var i = 0; i < jsonInvoiceList.length; i++) {
      eFattura.createInstance(xmlDocument, jsonInvoiceList[i]);
   }
   var output = Banana.Xml.save(xmlDocument);
   if (output != "@Cancel") {
      var xslt = "<?xml-stylesheet type='text/xsl' href='fatturaordinaria_v1.2.1.xslt'?>"
      var outputStyled = output.slice(0, 39) + xslt + output.slice(39)
      eFattura.saveData(outputStyled);
   }
}


function verifyParamInvoiceB2B(param) {
   param = verifyParam(param);
   if (!param.open_xml)
      param.open_xml = false;
   if (!param.output)
      param.output = 0;
   if (!param.progressive)
      param.progressive = 0;
   if (!param.selection)
      param.selection = 0;
   if (!param.selection_invoice)
      param.selection_invoice = '';
   if (!param.selection_customer)
      param.selection_customer = '';
      
   return param;
}


