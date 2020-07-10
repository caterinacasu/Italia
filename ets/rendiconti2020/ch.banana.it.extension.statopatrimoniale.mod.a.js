// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//  http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.it.extension.statopatrimoniale.mod.a
// @api = 1.0
// @pubdate = 2020-07-08
// @publisher = Banana.ch SA
// @description = Stato patrimoniale (MOD. A)
// @task = app.command
// @doctype = 100.100
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1


/*
   Stampa del rendiconto 'Stato patrimoniale (MOD. A)' secondo nuovi schemi di bilancio per il terzo settore.
   
   
   I modelli devono essere considerati come schemi “fissi”.
   È possibile suddividere le voci precedute da numeri arabi o da lettere minuscole dell'alfabeto,
   senza eliminare la voce complessiva e l'importo corrispondente.
   Gli enti che presentano voci precedute da numeri arabi o da lettere minuscole con importi nulli
   per due esercizi consecutivi possono eliminare dette voci.
   Possono aggiungere voci precedute da numeri arabi o da lettere minuscole dell'alfabeto.
   Eventuali raggruppamenti o eliminazioni delle voci di bilancio devono risultare esplicitati
   nella relazione di missione

*/



var userParam = {};


//Main function
function exec(string) {

   //Check if we are on an opened document
   if (!Banana.document) {
      return;
   }

   var userParam = initUserParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam && savedParam.length > 0) {
      userParam = JSON.parse(savedParam);
   }
   // If needed show the settings dialog to the user
   if (!options || !options.useLastSettings) {
      userParam = settingsDialog(); // From properties
   }
   if (!userParam) {
      return "@Cancel";
   }


   var report = printRendicontoModA(Banana.document, userParam);
   var stylesheet = Banana.Report.newStyleSheet();
   setCss(Banana.document, stylesheet, userParam);

   Banana.Report.preview(report, stylesheet);
}

function printRendicontoModA(banDoc, userParam) {

   var report = Banana.Report.newReport("Stato patrimoniale (MOD. A)");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;

   var title = "";
   if (userParam.title) {
      title = userParam.title;
   } else {
      title = banDoc.info("Base", "HeaderLeft") + " - " + "STATO PATRIMONIALE (MOD. A) ANNO " + currentYear;
   }
 
   var obj = "";
   var current = "";
   var previous = "";




   var listGr = getListGr(banDoc, "Gr");
   //Banana.console.log(listGr);

   var groups = {};
   getAccountsListGr(banDoc, "Gr", listGr, groups);
   //Banana.console.log(JSON.stringify(groups, "", " "));

   var balance = {}
   balance = calcBalances(banDoc, groups, startDate, endDate);
   // Banana.console.log(balance["AA"]);
   // Banana.console.log(balance["AA"].currentFormatted);
   // Banana.console.log(balance["AA"].previousFormatted);



   /**************************************************************************************
   * ATTIVO
   **************************************************************************************/
   report.addParagraph(title, "heading2");

   var table = report.addTable("table");
   var column1 = table.addColumn("column1");
   var column2 = table.addColumn("column2");
   var column3 = table.addColumn("column3");

   tableRow = table.addRow();
   tableRow.addCell("", "", 1);
   tableRow.addCell(Banana.Converter.toLocaleDateFormat(endDate), "table-header", 1);
   tableRow.addCell("31.12." + previousYear, "table-header", 1);

   tableRow = table.addRow();
   tableRow.addCell("ATTIVO", "assetsTitle", 3);

   /* AA */
   tableRow = table.addRow();
   tableRow.addCell("A) Quote associative o apporti ancora dovuti", "description-groups-titles", 1);
   tableRow.addCell(balance["AA"].currentFormatted, "amount-groups-titles", 1);
   tableRow.addCell(balance["AA"].previousFormatted, "amount-groups-titles", 1);

   tableRow = table.addRow();
   tableRow.addCell("B) Immobilizzazioni", "description-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);

   tableRow = table.addRow();
   tableRow.addCell("    I - Immobilizzazioni immateriali", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ABI1 */
   tableRow = table.addRow();
   tableRow.addCell("        1) costi di impianto e di ampliamento", "description-groups", 1);
   tableRow.addCell(balance["ABI1"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI1"].previousFormatted, "amount-groups", 1);

   /* ABI2 */
   tableRow = table.addRow();
   tableRow.addCell("        2) costi di sviluppo", "description-groups", 1);
   tableRow.addCell(balance["ABI2"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI2"].previousFormatted, "amount-groups", 1);

   /* ABI3 */
   tableRow = table.addRow();
   tableRow.addCell("        3) diritti di brevetto industriale e diritti di utilizzazione delle opere dell'ingegno", "description-groups", 1);
   tableRow.addCell(balance["ABI3"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI3"].previousFormatted, "amount-groups", 1);

   /* ABI4 */
   tableRow = table.addRow();
   tableRow.addCell("        4) concessioni, licenze, marchi e diritti simili", "description-groups", 1);
   tableRow.addCell(balance["ABI4"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI4"].previousFormatted, "amount-groups", 1);

   /* ABI5 */
   tableRow = table.addRow();
   tableRow.addCell("        5) avviamento", "description-groups", 1);
   tableRow.addCell(balance["ABI5"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI5"].previousFormatted, "amount-groups", 1);

   /* ABI6 */
   tableRow = table.addRow();
   tableRow.addCell("        6) immobilizzazioni in corso e acconti", "description-groups", 1);
   tableRow.addCell(balance["ABI6"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI6"].previousFormatted, "amount-groups", 1);

   /* ABI7 */
   tableRow = table.addRow();
   tableRow.addCell("        7) altre Immobilizzazioni immateriali", "description-groups", 1);
   tableRow.addCell(balance["ABI7"].currentFormatted, "amount-groups", 1);
   tableRow.addCell(balance["ABI7"].previousFormatted, "amount-groups", 1);

   /* tot ABI */
   var currTotABI = 0;
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI1"].current);
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI2"].current);
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI3"].current);
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI4"].current);
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI5"].current);
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI6"].current);
   currTotABI = Banana.SDecimal.add(currTotABI, balance["ABI7"].current);
   var prevTotABI = banDoc.table("Accounts").findRowByValue("Group", "ABI").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale immobilizzazioni immateriali", "description-groups-totals", 1);
   tableRow.addCell(formatValue(currTotABI), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(prevTotABI), "amount-groups-totals", 1);

   tableRow = table.addRow();
   tableRow.addCell("    II - Immobilizzazioni materiali", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ABII1 */
   obj = banDoc.currentBalance("Gr=ABII1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABII1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) terreni e fabbricati", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABII2 */
   obj = banDoc.currentBalance("Gr=ABII2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABII2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) impianti e macchinari", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABII3 */
   obj = banDoc.currentBalance("Gr=ABII3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABII3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) attrezzature", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABII4 */
   obj = banDoc.currentBalance("Gr=ABII4", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABII4").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        4) altri beni", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABII5 */
   obj = banDoc.currentBalance("Gr=ABII5", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABII5").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        5) immobilizzazioni in corso e acconti", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* tot ABII */
   obj = banDoc.currentBalance("Gr=ABII", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABII").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale immobilizzazioni materiali", "description-groups-totals", 1);
   tableRow.addCell(formatValue(current), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-totals", 1);

   tableRow = table.addRow();
   tableRow.addCell("    III - Immobilizzazioni finanziarie", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ABIII1 */
   tableRow = table.addRow();
   tableRow.addCell("        1) Partecipazioni", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ABIII1a */
   obj = banDoc.currentBalance("Gr=ABIII1a", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII1a").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            a) partecipazioni in imprese controllate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII1b */
   obj = banDoc.currentBalance("Gr=ABIII1b", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII1b").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            b) partecipazioni in imprese collegate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII1c */
   obj = banDoc.currentBalance("Gr=ABIII1c", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII1c").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            c) partecipazioni in altre imprese", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII2 */
   tableRow = table.addRow();
   tableRow.addCell("        2) Crediti", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ABIII2a */
   obj = banDoc.currentBalance("Gr=ABIII2a", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII2a").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            a) crediti verso imprese controllate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII2b */
   obj = banDoc.currentBalance("Gr=ABIII2b", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII2b").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            b) crediti verso imprese collegate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII2c */
   obj = banDoc.currentBalance("Gr=ABIII2c", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII2c").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            c) crediti verso altri enti del Terzo settore", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII2d */
   obj = banDoc.currentBalance("Gr=ABIII2d", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII2d").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("            d) crediti verso altri", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ABIII3 */
   obj = banDoc.currentBalance("Gr=ABIII3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) Altri titoli", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* tot ABIII */
   obj = banDoc.currentBalance("Gr=ABIII", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ABIII").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale immobilizzazioni finanziarie", "description-groups-totals", 1);
   tableRow.addCell(formatValue(current), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-totals", 1);

   /* tot AB */
   obj = banDoc.currentBalance("Gr=AB", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "AB").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("Totale immobilizzazioni B)", "description-totals", 1);
   tableRow.addCell(formatValue(current), "amount-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-totals", 1);

   /* AC */
   tableRow = table.addRow();
   tableRow.addCell("C) Attivo circolante", "description-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);

   /* ACI */
   tableRow = table.addRow();
   tableRow.addCell("    I - Rimanenze", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ACI1 */
   obj = banDoc.currentBalance("Gr=ACI1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACI1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) Rimanenze materie prime, sussidiarie e di consumo", "description-groups" ,1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACI2 */
   obj = banDoc.currentBalance("Gr=ACI2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACI2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) Rimanenze prodotti in corso di lavorazione e semilavorati", "description-groups" , 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACI3 */
   obj = banDoc.currentBalance("Gr=ACI3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACI3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) Rimanenze lavori in corso su ordinazione", "description-groups" , 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACI4 */
   obj = banDoc.currentBalance("Gr=ACI4", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACI4").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        4) Rimanenze prodotti finiti e merci", "description-groups" , 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACI5 */
   obj = banDoc.currentBalance("Gr=ACI5", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACI5").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        5) Rimanenze acconti", "description-groups" , 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* tot ACI */
   obj = banDoc.currentBalance("Gr=ACI", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACI").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale rimanenze", "description-groups-totals", 1);
   tableRow.addCell(formatValue(current), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-totals", 1);

   /* ACII */
   tableRow = table.addRow();
   tableRow.addCell("    II - Crediti", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ACII1 */
   obj = banDoc.currentBalance("Gr=ACII1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) Crediti verso utenti e clienti", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII2 */
   obj = banDoc.currentBalance("Gr=ACII2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) Crediti verso associati e fondatori", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII3 */
   obj = banDoc.currentBalance("Gr=ACII3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) Crediti verso enti pubblici", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII4 */
   obj = banDoc.currentBalance("Gr=ACII4", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII4").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        4) Crediti verso soggetti privati per contributi", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII5 */
   obj = banDoc.currentBalance("Gr=ACII5", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII5").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        5) Crediti verso enti della stessa rete associativa", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII6 */
   obj = banDoc.currentBalance("Gr=ACII6", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII6").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        6) Crediti verso altri enti del Terzo settore", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII7 */
   obj = banDoc.currentBalance("Gr=ACII7", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII7").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        7) Crediti verso imprese controllate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII8 */
   obj = banDoc.currentBalance("Gr=ACII8", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII8").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        8) Crediti verso imprese collegate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII9 */
   obj = banDoc.currentBalance("Gr=ACII9", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII9").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        9) Crediti tributari", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII10 */
   obj = banDoc.currentBalance("Gr=ACII10", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII10").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        10) Crediti da 5 per mille", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII11 */
   obj = banDoc.currentBalance("Gr=ACII11", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII11").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        11) Crediti per imposte anticipate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACII12 */
   obj = banDoc.currentBalance("Gr=ACII12", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII12").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        12) Crediti verso altri", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* tot ACII */
   obj = banDoc.currentBalance("Gr=ACII", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACII").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale crediti", "description-groups-totals", 1);
   tableRow.addCell(formatValue(current), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-totals", 1);

   /* ACIII */
   tableRow = table.addRow();
   tableRow.addCell("    III - Attività finanziarie che non costituiscono immobilizzazioni", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ACIII1 */
   obj = banDoc.currentBalance("Gr=ACIII1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIII1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) Partecipazioni in imprese controllate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACIII2 */
   obj = banDoc.currentBalance("Gr=ACIII2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIII2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) Partecipazioni in imprese collegate", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACIII3 */
   obj = banDoc.currentBalance("Gr=ACIII3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIII3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) Altri titoli", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* tot ACIII */
   obj = banDoc.currentBalance("Gr=ACIII", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIII").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale attività finanziarie che non costituiscono immobilizzazioni", "description-groups-totals", 1);
   tableRow.addCell(formatValue(current), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-totals", 1);

   /* ACIV */
   tableRow = table.addRow();
   tableRow.addCell("    IV - Disponibilità liquide", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* ACIV1 */
   obj = banDoc.currentBalance("Gr=ACIV1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIV1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) Depositi bancari e postali", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACIV2 */
   obj = banDoc.currentBalance("Gr=ACIV2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIV2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) Assegni", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* ACIV3 */
   obj = banDoc.currentBalance("Gr=ACIV3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIV3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) Danaro e valori in cassa", "description-groups", 1);
   tableRow.addCell(formatValue(current), "amount-groups", 1);
   tableRow.addCell(formatValue(previous), "amount-groups", 1);

   /* tot ACIV */
   obj = banDoc.currentBalance("Gr=ACIV", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "ACIV").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale disponibilità liquide", "description-groups-totals", 1);
   tableRow.addCell(formatValue(current), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-totals", 1);

   /* tot AC */
   obj = banDoc.currentBalance("Gr=AC", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "AC").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("Totale attivo circolante C)", "description-totals", 1);
   tableRow.addCell(formatValue(current), "amount-totals", 1);
   tableRow.addCell(formatValue(previous), "amount-totals", 1);

   /* AD */
   obj = banDoc.currentBalance("Gr=AD", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "AD").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("D) Ratei e risconti attivi", "description-groups-titles", 1);
   tableRow.addCell(formatValue(current), "amount-groups-titles", 1);
   tableRow.addCell(formatValue(previous), "amount-groups-titles", 1);

   report.addPageBreak();

   /**************************************************************************************
   * PASSIVO
   **************************************************************************************/
   report.addParagraph(title, "heading2");

   var table = report.addTable("table");
   var column1 = table.addColumn("column1");
   var column2 = table.addColumn("column2");
   var column3 = table.addColumn("column3");
   var column4 = table.addColumn("column4");

   tableRow = table.addRow();
   tableRow.addCell("", "", 1);
   tableRow.addCell(Banana.Converter.toLocaleDateFormat(endDate), "table-header", 1);
   tableRow.addCell("31.12." + previousYear, "table-header", 1);

   tableRow = table.addRow();
   tableRow.addCell("PASSIVO", "liabiltiesTitle", 3);

   tableRow = table.addRow();
   tableRow.addCell("A) Patrimonio netto", "description-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);

   /* PAI */
   obj = banDoc.currentBalance("Gr=PAI", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAI").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    I - Fondo di dotazione dell'ente", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PAII */
   tableRow = table.addRow();
   tableRow.addCell("    II - Patrimonio vincolato", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* PAII1 */
   obj = banDoc.currentBalance("Gr=PAII1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAII1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) Riserve statutarie", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PAII2 */
   obj = banDoc.currentBalance("Gr=PAII2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAII2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) Riserve vincolate per decisione degli organi istituzionali", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PAII3 */
   obj = banDoc.currentBalance("Gr=PAII3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAII3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        3) Riserve vincolate destinate da terzi", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* tot PAII */
   obj = banDoc.currentBalance("Gr=PAII", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAII").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale patrimonio vincolato", "description-groups-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups-totals", 1);

   /* PAIII */
   tableRow = table.addRow();
   tableRow.addCell("    III - Patrimonio libero", "description-groups", 1);
   tableRow.addCell("", "amount-groups", 1);
   tableRow.addCell("", "amount-groups", 1);

   /* PAIII1 */
   obj = banDoc.currentBalance("Gr=PAIII1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAIII1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        1) Riserve di utili o avanzi di gestione", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PAIII2 */
   obj = banDoc.currentBalance("Gr=PAIII2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAIII2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("        2) Altre riserve", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* tot PAIII */
   obj = banDoc.currentBalance("Gr=PAIII", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAIII").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    Totale patrimonio libero", "description-groups-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups-totals", 1);

   /* PAIV */
   obj = banDoc.currentBalance("Gr=PAIV", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PAIV").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    IV - Avanzo/disavanzo d'esercizio", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* tot PA */
   obj = banDoc.currentBalance("Gr=PA", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PA").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("Totale patrimonio netto A)", "description-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-totals", 1);

   /* PB */
   tableRow = table.addRow();
   tableRow.addCell("B) Fondi per rischi e oneri", "description-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);

   /* PB1 */
   obj = banDoc.currentBalance("Gr=PB1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PB1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    1) Fondi per trattamento di quiescenza e obblighi simili", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PB2 */
   obj = banDoc.currentBalance("Gr=PB2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PB2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    2) Fondi per imposte, anche differite", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PB3 */
   obj = banDoc.currentBalance("Gr=PB3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PB3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    3) Fondi altri", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* tot PB */
   obj = banDoc.currentBalance("Gr=PB", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PB").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("Totale fondi per rischi e oneri B)", "description-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-totals", 1);

   /* PC */
   obj = banDoc.currentBalance("Gr=PC", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PC").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("C) Fondi trattamento di fine rapporto di lavoro subordinato", "description-groups-titles", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups-titles", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups-titles", 1);

   /* PD */
   tableRow = table.addRow();
   tableRow.addCell("D) Debiti", "description-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);
   tableRow.addCell("", "amount-groups-titles", 1);

   /* PD1 */
   obj = banDoc.currentBalance("Gr=PD1", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD1").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    1) Debiti verso banche", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD2 */
   obj = banDoc.currentBalance("Gr=PD2", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD2").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    2) Debiti verso altri finanziatori", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD3 */
   obj = banDoc.currentBalance("Gr=PD3", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD3").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    3) Debiti verso associati e fondatori per finanziamenti", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD4 */
   obj = banDoc.currentBalance("Gr=PD4", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD4").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    4) Debiti verso enti della stessa rete associativa", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD5 */
   obj = banDoc.currentBalance("Gr=PD5", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD5").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    5) Debiti per erogazioni liberali condizionate", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD6 */
   obj = banDoc.currentBalance("Gr=PD6", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD6").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    6) Acconti (Debiti)", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD7 */
   obj = banDoc.currentBalance("Gr=PD7", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD7").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    7) Debiti verso fornitori", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD8 */
   obj = banDoc.currentBalance("Gr=PD8", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD8").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    8) Debiti verso imprese controllate e collegate", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD9 */
   obj = banDoc.currentBalance("Gr=PD9", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD9").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    9) Debiti tributari", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD10 */
   obj = banDoc.currentBalance("Gr=PD10", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD10").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    10) Debiti verso istituti di previdenza e di sicurezza sociale", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD11 */
   obj = banDoc.currentBalance("Gr=PD11", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD11").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    11) Debiti verso dipendenti e collaboratori", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* PD12 */
   obj = banDoc.currentBalance("Gr=PD12", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD12").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("    12) Altri debiti", "description-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups", 1);

   /* tot PD */
   obj = banDoc.currentBalance("Gr=PD", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PD").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("Totale debiti C)", "description-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-totals", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-totals", 1);

   /* PE */
   obj = banDoc.currentBalance("Gr=PE", startDate, endDate);
   current = obj.balance;
   previous = banDoc.table("Accounts").findRowByValue("Group", "PE").value("Prior");
   tableRow = table.addRow();
   tableRow.addCell("E) Ratei e risconti passivi", "description-groups-titles", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(current)), "amount-groups-titles", 1);
   tableRow.addCell(formatValue(Banana.SDecimal.invert(previous)), "amount-groups-titles", 1);


   //checkResults(banDoc, startDate, endDate);



   addFooter(report);
   return report;
}

function formatValue(value) {
   if (!value || value === "0" || value == null) {
      value = "0";
   }
   return Banana.Converter.toLocaleNumberFormat(value);
}

function checkResults(banDoc, startDate, endDate) {

   /* tot A */
   var objA = banDoc.currentBalance("Gr=A", startDate, endDate);
   currentA = objA.balance;

   /* tot P */
   var objP = banDoc.currentBalance("Gr=P", startDate, endDate);
   currentP = objP.balance;

   var res0 = Banana.SDecimal.add(currentA, currentP);
   if (res0 !== "0") {
      Banana.document.addMessage("Differenza Attivo e Passivo.");
   }
}

function addFooter(report) {
   report.getFooter().addClass("footer");
   report.getFooter().addText("- ", "");
   report.getFooter().addFieldPageNr();
   report.getFooter().addText(" -", "");
}

function setCss(banDoc, repStyleObj, userParam) {
   var textCSS = "";
   var file = Banana.IO.getLocalFile("file:script/rendicontoModA.css");
   var fileContent = file.read();
   if (!file.errorString) {
      Banana.IO.openPath(fileContent);
      //Banana.console.log(fileContent);
      textCSS = fileContent;
   } else {
      Banana.console.log(file.errorString);
   }
   // Parse the CSS text
   repStyleObj.parse(textCSS);
}

/**************************************************************************************
 * Utilities functions
 **************************************************************************************/
function getListGr(banDoc, grColumn) {

   /*
      Returns a list from the table Accounts of all the values for the given grColumn.

      i.e. "AA,A,AB,ABI,ABI1,ABI2,ABI3,..."

   */

   if (!grColumn) {
      grColumn = "Gr1";
   }

   var grList = new Set();

   for (var i = 0; i < banDoc.table('Accounts').rowCount; i++) {
      var tRow = banDoc.table('Accounts').row(i);
      if (tRow.value(grColumn)) {
         grList.add(tRow.value(grColumn));
      }
   }

   // convert set object to array
   var array = [];
   for (var i of grList) {
      array.push(i);
   }

   return array;
}

function getAccountsListGr(banDoc, columnGr, listGr, groups) {

   /*
      For each columnGr returns a list of accounts with the "|" separator.
      
      i.e.

      {
         "AA": "1000|",
         "A": "",
         "AB": "",
         "ABI": "",
         "ABI1": "1010|",
         "ABI2": "1020|",
         "ABI3": "1030|1031|",
         ...
      }

   */

   var listGrLength = listGr.length;
   var accountsRows = banDoc.table('Accounts').rowCount;

   for (var i = 0; i < listGrLength; i++) {

      //load groups with listGr elements
      groups[listGr[i]] = "";

      for (var j = 0; j < accountsRows; j++) {
         var tRow = banDoc.table('Accounts').row(j);
         var gr = tRow.value(columnGr);
         var account = tRow.value('Account');

         if (gr === listGr[i]
            && account
            && account.indexOf(".") < 0
            && account.indexOf(",") < 0
            && account.indexOf(";") < 0
            && account.indexOf(":") < 0) {
            groups[gr] += account + '|';
         }
         // else {
         //    // conto normale o conto ","
         // }
      }
   }

}

function calcBalances(banDoc, groups, startDate, endDate) {

   /*
      For each groups, we take the accounts and then we calculate the balances.
      Each groups has different properties from the currentBalance() function.
      We also add current, currentFormatted, previous, previousFormatted and isUsed properties.
      
      i.e.

      "AA": {
         "amount": "1.00",
         "amountCurrency": "",
         "bClass": "1",
         "balance": "1.00",
         "balanceCurrency": "",
         "credit": "",
         "creditCurrency": "",
         "debit": "1.00",
         "debitCurrency": "",
         "endDate": "2022-12-31",
         "opening": "",
         "openingCurrency": "",
         "rowCount": "1",
         "startDate": "2022-01-01",
         "total": "1.00",
         "totalCurrency": "",
         "current": "1.00",
         "currentFormatted": "1.00",
         "previous": "2.00",
         "previousFormatted": "2.00",
         "isUsed": true
      },
      ...

   */


   var balance = {}
   for (group in groups) {

      balance[group] = banDoc.currentBalance(groups[group], startDate, endDate);

      var obj = banDoc.currentBalance(groups[group], startDate, endDate);
      var current = "";
      var currentFormatted = "";
      var previous = "";
      var previousFormatted = "";
      var isUsed = false;

      // 1. current and previous balances
      if (obj.bClass === "1") {
         current = obj.balance;
         previous = banDoc.table("Accounts").findRowByValue("Group", group).value("Prior");
      } 
      else if (obj.bClass === "2") {
         current = Banana.SDecimal.invert(obj.balance);
         previous = Banana.SDecimal.invert(banDoc.table("Accounts").findRowByValue("Group", group).value("Prior"));
      }
      else if (obj.bClass === "3") {
         current = obj.total;
         previous = banDoc.table("Accounts").findRowByValue("Group", group).value("Prior");
      }
      else if (obj.bClass === "4") {
         current = Banana.SDecimal.invert(obj.total);
         previous = Banana.SDecimal.invert(banDoc.table("Accounts").findRowByValue("Group", group).value("Prior"));
      }

      // 2. current formatted balance
      currentFormatted = formatValue(current);

      // 3. previous formatted balance
      previousFormatted = formatValue(previous);

      // 4. isUsed
      if (current || previous) {
         isUsed = true;
      }

      balance[group].current = current;
      balance[group].currentFormatted = currentFormatted;
      balance[group].previous = previous;
      balance[group].previousFormatted = previousFormatted;
      balance[group].isUsed = isUsed;
   }

   //Banana.console.log(JSON.stringify(balance, "", " "));

   return balance;
}



/**************************************************************************************
 * Functions to manage the parameters
 **************************************************************************************/
function convertParam(userParam) {

   var convertedParam = {};
   convertedParam.version = '1.0';
   convertedParam.data = [];

   var currentParam = {};
   currentParam.name = 'title';
   currentParam.title = 'Titolo';
   currentParam.type = 'string';
   currentParam.value = userParam.title ? userParam.title : '';
   currentParam.defaultvalue = '';
   currentParam.readValue = function() {
      userParam.title = this.value;
   }
   convertedParam.data.push(currentParam);

    // var currentParam = {};
    // currentParam.name = 'exclude_zero_amounts';
    // currentParam.title = 'Escludi voci con importi nulli per due esercizi consecutivi';
    // currentParam.type = 'bool';
    // currentParam.value = userParam.exclude_zero_amounts ? true : false;
    // currentParam.defaultvalue = false;
    // currentParam.readValue = function() {
    //     userParam.exclude_zero_amounts = this.value;
    // }
    // convertedParam.data.push(currentParam);

   return convertedParam;
}

function initUserParam() {
   var userParam = {};
   userParam.title = "";
   userParam.exclude_zero_amounts = false;
   return userParam;
}

function parametersDialog(userParam) {
   if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
      var dialogTitle = "Parametri";
      var convertedParam = convertParam(userParam);
      var pageAnchor = 'dlgSettings';
      if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
         return null;
      }
      for (var i = 0; i < convertedParam.data.length; i++) {
         // Read values to userParam (through the readValue function)
         convertedParam.data[i].readValue();
      }
      //  Reset reset default values
      userParam.useDefaultTexts = false;
   }

   return userParam;
}

function settingsDialog() {
   var scriptform = initUserParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam && savedParam.length > 0) {
      scriptform = JSON.parse(savedParam);
   }

   //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
   var docStartDate = Banana.document.startPeriod();
   var docEndDate = Banana.document.endPeriod();

   //A dialog window is opened asking the user to insert the desired period. By default is the accounting period
   var selectedDates = Banana.Ui.getPeriod('', docStartDate, docEndDate,
      scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);

   //We take the values entered by the user and save them as "new default" values.
   //This because the next time the script will be executed, the dialog window will contains the new values.
   if (selectedDates) {
      scriptform["selectionStartDate"] = selectedDates.startDate;
      scriptform["selectionEndDate"] = selectedDates.endDate;
      scriptform["selectionChecked"] = selectedDates.hasSelection;
   } else {
      //User clicked cancel
      return null;
   }

   scriptform = parametersDialog(scriptform); // From propertiess
   if (scriptform) {
      var paramToString = JSON.stringify(scriptform);
      Banana.document.setScriptSettings(paramToString);
   }

   return scriptform;
}

